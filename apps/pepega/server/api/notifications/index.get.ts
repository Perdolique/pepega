import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { notificationEventTypeSchema } from '~~/server/utils/validation'
import type { NotificationModel } from '~~/shared/models/notifications'

const routeParamsSchema = v.object({
  type: notificationEventTypeSchema
})

function validateRouterParams(params: unknown) {
  return v.parse(routeParamsSchema, params)
}

export default defineEventHandler(async (event) : Promise<NotificationModel> => {
  const { type } = await getValidatedQuery(event, validateRouterParams)
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
      statusCode: 404,
      statusMessage: 'Notification not found'
    })
  }

  return {
    id: notification.id,
    isActive: notification.isActive
  }
})
