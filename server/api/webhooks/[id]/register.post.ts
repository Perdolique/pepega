import { and, eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
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

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator)

  {
    const storage = useStorage('kv')

    await storage.setItem('test', 'POOQUE')

    const testResult = await storage.getItem('test')

    console.log('KV TEST:', testResult);

    await storage.removeItem('test')
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
  const tokenResponse = await getAppAccessToken()

  console.log('token will expire in', tokenResponse.expires_in)

  return sendNoContent(event)
})
