import * as v from 'valibot'
import { count, eq, sql } from 'drizzle-orm'
import { configKeys } from '@pepega/database/constants'
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
import { checkAdmin } from '~~/server/utils/admin'

const bodySchema = v.object({
  // TODO: I have no idea how it should be validated ¯\(ツ)/¯
  chatId: v.pipe(
    v.string(),
    v.regex(/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/u)
  )
})

function bodyValidator(body: unknown) {
  return v.parse(bodySchema, body)
}

function throwCreateChannelError(logMessage: string, logContext: Record<string, unknown>) : never {
  logger.error(logMessage, logContext)

  throw createError({
    statusCode: 500,
    message: 'Failed to create telegram channel'
  })
}

export default defineEventHandler(async (event) : Promise<TelegramChannelModel> => {
  const { chatId } = await readValidatedBody(event, bodyValidator)
  const { db, userId } = event.context
  const isAdmin = await checkAdmin(event)
  const dbWebSocket = createDatabaseWebsocket()

  // For admins, we don't check the limit

  if (isAdmin) {
    const [insertedChannel] = await db
      .insert(tables.telegramChannels)
      .values({
        userId,
        chatId
      })
      .onConflictDoNothing()
      .returning()

    if (insertedChannel === undefined) {
      throw createError({
        statusCode: 500,
        message: 'Failed to insert telegram channel'
      })
    }

    return insertedChannel
  }

  // For regular users, we check the limit

  const result = await dbWebSocket.transaction(async (transaction) => {
    // 1. Get confing from the database
    const config = await transaction.query.config.findFirst({
      columns: {},
      where: eq(tables.config.key, configKeys.maxTelegramChannelsPerUser),
      extras: {
        value: sql<number>`CAST(${tables.config.value} AS INTEGER)`.as('value')
      }
    })

    if (config === undefined) {
      throwCreateChannelError('Failed to get telegram channels config', {
        userId,
        chatId
      })
    }

    // 2. Get the number of telegram channels for the user
    const [countResult] = await transaction
      .select({
        count: count()
      })
      .from(tables.telegramChannels)
      .where(
        eq(tables.telegramChannels.userId, userId)
      )

    if (countResult === undefined) {
      throwCreateChannelError('Failed to get telegram channels count', {
        userId,
        chatId
      })
    }

    if (countResult.count >= config.value) {
      throw createError({
        statusCode: 403,
        message: 'Max telegram channels reached'
      })
    }

    const [insertedChannel] = await transaction
      .insert(tables.telegramChannels)
      .values({
        userId,
        chatId
      })
      .onConflictDoNothing()
      .returning()

    if (insertedChannel === undefined) {
      throw createError({
        statusCode: 500,
        message: 'Failed to insert telegram channel'
      })
    }

    return insertedChannel
  })

  return result
})
