import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { encrypt } from '@pepega/utils/crypto'
import { subscribeWebhook } from '~~/server/utils/twitch/event-sub/stream-online'
import { webhookIdSchema } from '~~/server/utils/validation'
import { type WebhookStatus } from '~~/shared/models/webhooks'
import { getStoredToken, obtainTwitchAppToken } from '~~/server/utils/twitch/auth'

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

interface ResponseData {
  webhookId: number;
  status: WebhookStatus;
}

export default defineEventHandler(async (event) : Promise<ResponseData> => {
  const { userId, twitch } = event.context
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator)
  const db = createDatabaseWebsocket()
  const webhookBaseUrl = getValidatedWebhookBaseUrl()
  const twitchClientId = getValidatedTwitchClientId()
  const encryptionKey = getValidatedEncryptionKey()
  let finalStatus: WebhookStatus = 'pending'

  // 1. Find webhook by id
  const [webhook] = await db
    .select({
      webhookId: tables.webhooks.id,
      broadcasterId: tables.streamers.broadcasterId,
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
    logger.error(`Webhook with id ${webhookId} not found`)

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
      appAccessToken = await obtainTwitchAppToken(encryptionKey)
    }

    let registrationResponse = await subscribeWebhook({
      appAccessToken,
      clientId: twitchClientId,
      broadcasterUserId: `${webhook.broadcasterId}`,
      callbackUrl: `${webhookBaseUrl}/online`,
      secret: webhookSecret
    })

    if (registrationResponse.error !== undefined) {
      throw registrationResponse.error
    }

    await db.update(tables.webhooks)
      .set({ subscriptionId: registrationResponse.data.data[0]?.id })
      .where(
        eq(tables.webhooks.id, webhook.webhookId)
      )

    if (import.meta.dev) {
      logger.info(`Webhook ${registrationResponse.data.data[0]?.type} registered (secret: ${webhookSecret})`)
    }
  } catch (error) {
    logger.error('Failed to register webhook', error)

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
