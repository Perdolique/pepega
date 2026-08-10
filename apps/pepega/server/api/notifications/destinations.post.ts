import { and, eq, sql } from 'drizzle-orm'
import * as v from 'valibot'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'
import { limits } from '~~/constants'
import { tables } from '~~/server/utils/database'
import { idNumberSchema } from '~~/server/utils/validation'
import { createError, defineEventHandler, readValidatedBody } from 'h3'

const routeParamsSchema = v.strictObject({
  notificationId: idNumberSchema,
  message: v.pipe(v.string(), v.nonEmpty(), v.maxLength(limits.notificationMessageLength)),
  telegramChannelId: idNumberSchema
})

function validateRouterParams(params: unknown) {
  return v.parse(routeParamsSchema, params)
}

export default defineEventHandler(async (event) : Promise<NotificationDestinationModel> => {
  const { notificationId, message, telegramChannelId } = await readValidatedBody(event, validateRouterParams)
  const { userId, db } = event.context

  // Ensure the user is a streamer and has access to the notification with the given ID
  const streamerNotification = db
    .$with('streamerNotification')
    .as(
      db.select({
        id: tables.notifications.id,
      })
      .from(tables.notifications)
      .innerJoin(
        tables.streamers,
        eq(tables.streamers.id, tables.notifications.streamerId)
      )
      .where(
        and(
          eq(tables.notifications.id, notificationId),
          eq(tables.streamers.userId, userId)
        )
      )
    )

  // Ensure the telegram channel ID is valid, belongs to the user and verified
  const telegramChannel = db
    .$with('telegramChannel')
    .as(
      db.select({
        id: tables.telegramChannels.id,
      })
      .from(tables.telegramChannels)
      .where(
        and(
          eq(tables.telegramChannels.id, telegramChannelId),
          eq(tables.telegramChannels.userId, userId),
          eq(tables.telegramChannels.isVerified, true)
        )
      )
    )

  // Get provider ID for Telegram
  const telegramProvider = db
    .$with('telegramProvider')
    .as(
      db.select({
        id: tables.notificationProviders.id
      })
      .from(tables.notificationProviders)
      .where(
        eq(tables.notificationProviders.type, 'telegram')
      )
    )

  const [destination] = await db
    .with(streamerNotification, telegramChannel, telegramProvider)
    .insert(tables.notificationDestinations)
    .values({
      notificationId: sql`(SELECT id FROM ${streamerNotification})`,
      message,
      telegramChannelId: sql`(SELECT id FROM ${telegramChannel})`,
      config: { type: 'telegram' },
      providerId: sql`(SELECT id FROM ${telegramProvider})`
    })
    .onConflictDoUpdate({
      target: [
        tables.notificationDestinations.notificationId,
        tables.notificationDestinations.providerId
      ],

      set: {
        message: sql`excluded."message"`,
        telegramChannelId: sql`excluded."telegramChannelId"`
      }
    })
    .returning({
      id: tables.notificationDestinations.id,
      isActive: tables.notificationDestinations.isActive,
      config: tables.notificationDestinations.config,
      message: tables.notificationDestinations.message,
      telegramChannelId: tables.notificationDestinations.telegramChannelId
    })

  if (destination === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to create notification destination'
    })
  }

  return destination;
})
