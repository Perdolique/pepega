import type { ApiRequestEvent } from '#shared/types/api-request'
import { createError, defineEventHandler, isNuxtError, readValidatedBody } from 'nuxt/server'
import * as v from 'valibot'
import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub'
import { createDatabaseWebsocket, tables } from '~~/server/utils/database'
import logger from '~~/server/utils/logger'

const bodySchema = v.object({
  type: v.union([
    v.literal<EventSubscriptionType>('stream.online')
  ])
})

export default defineEventHandler(async (
  event: ApiRequestEvent<{ body: v.InferInput<typeof bodySchema> }>
) => {
  const { type } = await readValidatedBody(event, bodySchema)
  const { userId } = event.context

  const db = createDatabaseWebsocket()

  const transaction = db.transaction(async (transaction) => {
    const streamer = await transaction.query.streamers.findFirst({
      columns: {
        id: true
      },

      where: {
        userId
      }
    })

    if (streamer === undefined) {
      throw createError({
        status: 404,
        message: 'Streamer not found'
      })
    }

    const [insertedWebhook] = await transaction
      .insert(tables.webhooks)
      .values({
        type,
        streamerId: streamer.id
      })
      .returning()

    return insertedWebhook
  })

  try {
    const insertedWebhook = await transaction

    if (insertedWebhook === undefined) {
      logger.error('Failed to insert webhook', { type, userId })

      throw createError({
        status: 500
      })
    }

    return insertedWebhook
  } catch (error) {
    if (isNuxtError(error)) {
      throw error
    }

    logger.error('Failed to insert webhook', error)

    throw createError({
      status: 500
    })
  }
})
