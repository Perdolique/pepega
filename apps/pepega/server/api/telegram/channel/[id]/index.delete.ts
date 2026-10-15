import { parseRouterParams } from '~~/server/utils/request-validation'
import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { idStringAsNumberSchema } from '~~/server/utils/validation'
import { tables } from '~~/server/utils/database'
import { createError, defineEventHandler } from 'nuxt/server'

const paramsSchema = v.object({
  id: idStringAsNumberSchema
})

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: channelId } = parseRouterParams(event, paramsSchema)

  const deleted = await db
    .delete(tables.telegramChannels)
    .where(
      and(
        eq(tables.telegramChannels.id, channelId),
        eq(tables.telegramChannels.userId, userId)
      )
    )
    .returning({
      id: tables.telegramChannels.id
    })

  // TODO: handle error in client
  if (deleted.length === 0) {
    throw createError({
      status: 404,
      message: 'Channel not found'
    })
  }

  event.res.status = 204

  return null
})
