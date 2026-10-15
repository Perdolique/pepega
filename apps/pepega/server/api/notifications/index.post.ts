import type { ApiRequestEvent } from '#shared/types/api-request'
import { eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
import { notificationEventTypeSchema } from '~~/server/utils/validation'
import type { NotificationModel } from '~~/shared/models/notifications'
import { tables } from '~~/server/utils/database'
import { createError, defineEventHandler, readValidatedBody } from 'nuxt/server'

const routeParamsSchema = v.object({
  eventType: notificationEventTypeSchema
})

export default defineEventHandler(async (
  event: ApiRequestEvent<{ body: v.InferInput<typeof routeParamsSchema> }>
) : Promise<NotificationModel> => {
  const { eventType } = await readValidatedBody(event, routeParamsSchema)
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
      status: 400,
      statusText: 'Failed to create notification'
    })
  }

  return notification;
})
