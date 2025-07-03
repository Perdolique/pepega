import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'

const routeParamsSchema = v.object({
  notificationId: stringToIntegerSchema
})

function validateRouterParams(params: unknown) {
  return v.parse(routeParamsSchema, params)
}

export default defineEventHandler(async (event) : Promise<NotificationDestinationModel[]> => {
  const { notificationId } = await getValidatedQuery(event, validateRouterParams)
  const { userId, db } = event.context

  const result = await db
    .select({
      id: tables.notificationDestinations.id,
      config: tables.notificationDestinations.config,
      isActive: tables.notificationDestinations.isActive
    })
    .from(tables.notificationDestinations)
    .innerJoin(
      tables.notifications,
      eq(tables.notifications.id, tables.notificationDestinations.notificationId)
    )
    .innerJoin(
      tables.streamers,
      eq(tables.streamers.id, tables.notifications.streamerId)
    )
    .where(
      and(
        eq(tables.notifications.id, notificationId),
        eq(tables.streamers.userId, userId),
      )
    )

  return result
})
