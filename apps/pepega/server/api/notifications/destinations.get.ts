import type { ApiRequestEvent } from '#shared/types/api-request'
import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'
import { tables } from '~~/server/utils/database'
import { stringToIntegerSchema } from '~~/server/utils/validation'
import { defineEventHandler, getValidatedQuery } from 'nuxt/server'

const routeParamsSchema = v.object({
  notificationId: stringToIntegerSchema
})

export default defineEventHandler(async (
  event: ApiRequestEvent<{ query: v.InferInput<typeof routeParamsSchema> }>
) : Promise<NotificationDestinationModel[]> => {
  const { notificationId } = await getValidatedQuery(event, routeParamsSchema)
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
