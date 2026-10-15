import type { ApiRequestEvent } from '#shared/types/api-request'
import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { notificationEventTypeSchema } from '~~/server/utils/validation'
import type { NotificationModel } from '~~/shared/models/notifications'
import { tables } from '~~/server/utils/database'
import { createError, defineEventHandler, getValidatedQuery } from 'nuxt/server'

const routeParamsSchema = v.object({
  type: notificationEventTypeSchema
})

export default defineEventHandler(async (
  event: ApiRequestEvent<{ query: v.InferInput<typeof routeParamsSchema> }>
) : Promise<NotificationModel> => {
  const { type } = await getValidatedQuery(event, routeParamsSchema)
  const { userId, db } = event.context

  const [notification] = await db
    .select({
      id: tables.notifications.id,
      isActive: tables.notifications.isActive
    })
    .from(tables.notifications)
    .innerJoin(
      tables.streamers,
      eq(tables.streamers.id, tables.notifications.streamerId)
    )
    .where(
      and(
        eq(tables.notifications.eventType, type),
        eq(tables.streamers.userId, userId),
      )
    )
    .limit(1)

  if (notification === undefined) {
    throw createError({
      status: 404,
      statusText: 'Notification not found'
    })
  }

  return {
    id: notification.id,
    isActive: notification.isActive
  }
})
