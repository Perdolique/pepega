import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'

const paramsSchema = v.object({
  id: webhookIdSchema
})

function idValidator(params: unknown) {
  return v.parse(paramsSchema, params)
}

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator)

  const [webhook] = await db
    .select({
      id: tables.webhooks.id,
      status: tables.webhooks.status,
      type: tables.webhooks.type,
      createdAt: tables.webhooks.createdAt
    })
    .from(tables.webhooks)
    .innerJoin(
      tables.streamers,
      eq(tables.streamers.id, tables.webhooks.streamerId)
    )
    .where(
      and(
        eq(tables.webhooks.id, webhookId),
        eq(tables.streamers.userId, userId)
      )
    )
    .limit(1)

  if (webhook === undefined) {
    logger.warn(`Webhook ${webhookId} not found`)

    throw createError({
      statusCode: 404
    })
  }

  return webhook
})
