import { and, eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
import { kvStorageKeys, kvStorageName } from '~~/constants'
import { getAppAccessToken } from '~~/server/utils/provider-twitch'
import { webhookIdSchema } from '~~/server/utils/validation'
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

type WebhookSelectType = typeof tables.webhooks.$inferSelect

function validateWebhookStatus(webhook?: WebhookSelectType) : WebhookSelectType {
  if (webhook === undefined) {
    console.error(`Webhook with not found`)

    throw createError({
      statusCode: 404
    })
  }

  const { output: status, success } = v.safeParse(webhookStatusSchema, webhook.status)

  if (success === false) {
    console.error(`Webhook with id ${webhook.id} has invalid status "${webhook.status}"`)

    throw createError({
      statusCode: 500
    })
  }

  if (status === 'active' || status === 'pending') {
    console.error(`Webhook with id ${webhook.id} is already in status "${status}"`)

    throw createError({
      statusCode: 400
    })
  }

  return webhook
}

async function getNewAppAccessToken(encryptionKey: string) {
  const storage = useStorage(kvStorageName)
  const tokenResponse = await getAppAccessToken()
  const encryptedToken = await encrypt(tokenResponse.access_token, encryptionKey)

  await storage.setItem(kvStorageKeys.twitchAppAccessToken, encryptedToken, {
    expirationTtl: tokenResponse.expires_in
  })

  console.log('Stored new token: ', tokenResponse.access_token.slice(0, 3), '...', tokenResponse.access_token.slice(-3))

  return tokenResponse.access_token
}

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator)
  const { KV_ENCRYPTION_KEY } = process.env

  if (KV_ENCRYPTION_KEY === undefined) {
    console.error('KV_ENCRYPTION_KEY is not set')

    throw createError({
      statusCode: 500
    })
  }

  const streamerQuery = db
    .$with('streamers')
    .as(
      db.select({
        id: tables.streamers.id
      })
        .from(tables.streamers)
        .where(
          eq(tables.streamers.userId, userId)
        )
    )

  const [foundWebhook] = await db
    .with(streamerQuery)
    .select()
    .from(tables.webhooks)
    .where(
      and(
        eq(tables.webhooks.streamerId, sql`(SELECT id FROM ${streamerQuery})`),
        eq(tables.webhooks.id, webhookId)
      )
    )

  const webhook = validateWebhookStatus(foundWebhook)

  // // 1. Update webhook status to 'pending'
  // await db
  //   .update(tables.webhooks)
  //   .set({
  //     status: 'pending'
  //   })
  //   .where(
  //     eq(tables.webhooks.id, webhook.id)
  //   )

  // 2. Register webhook on Twitch
  // TODO: store this token for future use (it usually expires in a few hours)
  let appAccessToken
  const storage = useStorage(kvStorageName)
  const encryptedStoredToken = await storage.getItem<string>(kvStorageKeys.twitchAppAccessToken)

  if (encryptedStoredToken === null) {
    console.log('No stored token found, fetching a new one')

    const token = await getNewAppAccessToken(KV_ENCRYPTION_KEY)

    appAccessToken = token
  } else {
    console.log('Found stored token, decrypting')

    try {
      const storedToken = await decrypt(encryptedStoredToken, KV_ENCRYPTION_KEY)

      console.log('Decrypted token: ', storedToken.slice(0, 3), '...', storedToken.slice(-3))

      appAccessToken = storedToken
    } catch (error) {
      console.error('Failed to decrypt stored token', error)

      await storage.removeItem(kvStorageKeys.twitchAppAccessToken)

      const token = await getNewAppAccessToken(KV_ENCRYPTION_KEY)

      appAccessToken = token

      return sendNoContent(event)
    }
  }

  return sendNoContent(event)
})
