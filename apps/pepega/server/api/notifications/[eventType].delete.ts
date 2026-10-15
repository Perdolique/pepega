import { parseRouterParams } from '~~/server/utils/request-validation'
import { and, eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
import { notificationEventTypeSchema } from '~~/server/utils/validation'
import { tables } from '~~/server/utils/database'
import { createError, defineEventHandler } from 'nuxt/server'

const routeParamsSchema = v.object({
  eventType: notificationEventTypeSchema
})

export default defineEventHandler(async (event) : Promise<null> => {
  const { eventType } = parseRouterParams(event, routeParamsSchema)
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
      status: 404,
      statusText: 'Notification not found'
    })
  }

  event.res.status = 204

  return null
})
