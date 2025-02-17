import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { encrypt, decrypt } from '@pepega/utils/crypto'
import { kvStorageKeys, kvStorageName } from '~~/constants'
import { getAppAccessToken } from '~~/server/utils/provider-twitch'
import { subscribeWebhook } from '~~/server/utils/twitch/event-sub/stream-online'
import { getValidatedEnv, webhookIdSchema } from '~~/server/utils/validation'
import { type WebhookStatus } from '~~/shared/models/webhooks'

const paramsSchema = v.object({
  id: webhookIdSchema
})

const webhookStatusSchema = v.union([
  v.literal<WebhookStatus>('not_active'),
  v.literal<WebhookStatus>('active'),
  v.literal<WebhookStatus>('pending'),
  v.literal<WebhookStatus>('failed'),
  v.literal<WebhookStatus>('revoked')
])

function idValidator(params: unknown) {
  return v.parse(paramsSchema, params)
}

function validateWebhookStatus(webhookStatus: string) : void {
  const { output: status, success } = v.safeParse(webhookStatusSchema, webhookStatus)

  if (success === false) {
    throw new Error(`Webhook has invalid status "${webhookStatus}"`)
  }

  if (status === 'active' || status === 'pending') {
    throw new Error(`Webhook is already in status "${status}"`)
  }
}

async function getStoredToken(encryptionKey: string) : Promise<string | null> {
  const storage = useStorage(kvStorageName)
  const encryptedStoredToken = await storage.getItem<string>(kvStorageKeys.twitchAppAccessToken)

  if (encryptedStoredToken === null) {
    return null
  }

  try {
    return await decrypt(encryptedStoredToken, encryptionKey)
  } catch {
    console.error('Failed to decrypt stored token')

    return null
  }
}

/**
 * Gets the app access token from KV storage or requests a new one from Twitch
 *
 * Safe expiration time calculation 🕒:
 * - Tokens valid > 1h: expires_in - 1h
 * - Tokens valid < 1h: expires_in * 0.9
 */
async function obtainAndStoreToken(encryptionKey: string) {
  // Get new app access token
  const tokenResponse = await getAppAccessToken()
  const storage = useStorage(kvStorageName)
  const encryptedToken = await encrypt(tokenResponse.access_token, encryptionKey)

  // Calculate safe expiration time - either 1 hour less or 10% less
  const ONE_HOUR = 3600

  const safeExpirationTime = tokenResponse.expires_in > ONE_HOUR
    ? tokenResponse.expires_in - ONE_HOUR  // Subtract 1 hour for longer-lived tokens
    : Math.floor(tokenResponse.expires_in * 0.9)  // Subtract 10% for shorter-lived tokens

  await storage.setItem(kvStorageKeys.twitchAppAccessToken, encryptedToken, {
    expirationTtl: safeExpirationTime
  })

  return tokenResponse.access_token
}

interface ResponseData {
  webhookId: number;
  status: WebhookStatus;
}

export default defineEventHandler(async (event) : Promise<ResponseData> => {
  const { userId } = event.context
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator)
  const db = createDatabaseWebsocket()
  const { webhookBaseUrl, twitchClientId, encryptionKey } = getValidatedEnv()
  let finalStatus: WebhookStatus = 'pending'

  // 1. Find webhook by id
  const [webhook] = await db
    .select({
      webhookId: tables.webhooks.id,
      broadcasterId: tables.streamers.twitchBroadcasterId,
      status: tables.webhooks.status
    })
    .from(tables.webhooks)
    .innerJoin(tables.streamers,
      eq(tables.streamers.userId, userId)
    )
    .where(
      and(
        eq(tables.webhooks.streamerId, tables.streamers.id),
        eq(tables.webhooks.id, webhookId)
      )
    )

  // 2. Check if webhook exists
  if (webhook === undefined) {
    console.error(`Webhook with id ${webhookId} not found`)

    throw createError({
      statusCode: 404
    })
  }

  // 3. Validate webhook status
  validateWebhookStatus(webhook.status)

  // 4 Create a new secret for the webhook
  const webhookSecret = crypto.randomUUID()
  const encryptedWebhookSecret = await encrypt(webhookSecret, encryptionKey)

  // 5. Update webhook status to 'pending'
  await db
    .update(tables.webhooks)
    .set({
      status: 'pending',
      secret: encryptedWebhookSecret
    })
    .where(
      eq(tables.webhooks.id, webhook.webhookId)
    )

  finalStatus = 'pending'

  // 5. Register webhook on Twitch
  try {
    let appAccessToken = await getStoredToken(encryptionKey)

    if (appAccessToken === null) {
      appAccessToken = await obtainAndStoreToken(encryptionKey)
    }

    // TODO: Jeez, this is a lot of similar code. Maybe we should extract it into a function?
    let registrationResponse = await subscribeWebhook({
      appAccessToken,
      clientId: twitchClientId,
      broadcasterUserId: `${webhook.broadcasterId}`,
      callbackUrl: `${webhookBaseUrl}/online`,
      secret: webhookSecret
    })

    if (registrationResponse.error !== undefined && registrationResponse.error.statusCode === 401) {
      appAccessToken = await obtainAndStoreToken(encryptionKey)

      registrationResponse = await subscribeWebhook({
        appAccessToken,
        clientId: twitchClientId,
        broadcasterUserId: `${webhook.broadcasterId}`,
        callbackUrl: `${webhookBaseUrl}/online`,
        secret: webhookSecret
      })
    }

    if (registrationResponse.error !== undefined) {
      throw registrationResponse.error
    }

    await db.update(tables.webhooks)
      .set({ subscriptionId: registrationResponse.data.data[0]?.id })
      .where(
        eq(tables.webhooks.id, webhook.webhookId)
      )

    if (import.meta.dev) {
      console.info(`Webhook ${registrationResponse.data.data[0]?.type} registered (secret: ${webhookSecret})`)
    }
  } catch (error) {
    console.error('Failed to register webhook', error)

    // Update webhook status to 'failed'
    await db
      .update(tables.webhooks)
      .set({ status: 'failed' })
      .where(
        eq(tables.webhooks.id, webhook.webhookId)
      )

    finalStatus = 'failed'
  }

  return {
    webhookId: webhook.webhookId,
    status: finalStatus
  }
})
