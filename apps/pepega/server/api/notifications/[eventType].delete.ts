import { and, eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
import { notificationEventTypeSchema } from '~~/server/utils/validation'

const routeParamsSchema = v.object({
  eventType: notificationEventTypeSchema
})

function validateRouterParams(params: unknown) {
  return v.parse(routeParamsSchema, params)
}

export default defineEventHandler(async (event) : Promise<void> => {
  const { eventType } = await getValidatedRouterParams(event, validateRouterParams)
  const { userId, db } = event.context

  const streamer = db
    .$with('streamer')
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
    .with(streamer)
    .delete(tables.notifications)
    .where(
      and(
        eq(tables.notifications.eventType, eventType),
        eq(tables.notifications.streamerId, sql`(SELECT id FROM ${streamer})`)
      )
    )
    .returning({
      id: tables.notifications.id
    })

  if (deleted.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Notification not found'
    })
  }

  sendNoContent(event)
})
