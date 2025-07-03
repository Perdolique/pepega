import { H3Error } from 'h3'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub'

const bodySchema = v.object({
  type: v.union([
    v.literal<EventSubscriptionType>('stream.online')
  ])
})

function bodyValidator(body: unknown) {
  return v.parse(bodySchema, body)
}

export default defineEventHandler(async (event) => {
  const { type } = await readValidatedBody(event, bodyValidator)
  const { userId } = event.context

  const db = createDatabaseWebsocket()

  const transaction = db.transaction(async (transaction) => {
    const streamer = await transaction.query.streamers.findFirst({
      columns: {
        id: true
      },

      where: eq(tables.streamers.userId, userId)
    })

    if (streamer === undefined) {
      throw createError({
        statusCode: 404,
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
        statusCode: 500
      })
    }

    return insertedWebhook
  } catch (error) {
    if (error instanceof H3Error) {
      throw error
    }

    logger.error('Failed to insert webhook', error)

    throw createError({
      statusCode: 500
    })
  }
})
