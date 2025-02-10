import { and, eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
import { webhookIdSchema } from '~~/server/utils/validation'

const paramsSchema = v.object({
  id: webhookIdSchema
})

function idValidator(params: unknown) {
  return v.parse(paramsSchema, params)
}

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator)

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

  const deleted = await db
    .with(streamerQuery)
    .delete(tables.webhooks)
    .where(
      and(
        eq(tables.webhooks.streamerId, sql`(SELECT id FROM ${streamerQuery})`),
        eq(tables.webhooks.id, webhookId)
      )
    )
    .returning({
      id: tables.webhooks.id
    })

  if (deleted.length === 0) {
    throw createError({
      statusCode: 404
    })
  }

  return sendNoContent(event)
})
