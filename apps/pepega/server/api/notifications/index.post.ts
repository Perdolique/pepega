import { eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
import { notificationEventTypeSchema } from '~~/server/utils/validation'
import type { NotificationModel } from '~~/shared/models/notifications'

const routeParamsSchema = v.object({
  eventType: notificationEventTypeSchema
})

function validateRouterParams(params: unknown) {
  return v.parse(routeParamsSchema, params)
}

export default defineEventHandler(async (event) : Promise<NotificationModel> => {
  const { eventType } = await readValidatedBody(event, validateRouterParams)
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

  const [notification] = await db
    .with(streamer)
    .insert(tables.notifications)
    .values({
      eventType,
      streamerId: sql`(SELECT id FROM ${streamer})`,
    })
    .returning({
      id: tables.notifications.id,
      isActive: tables.notifications.isActive
    })

  if (notification === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to create notification'
    })
  }

  return notification;
})
