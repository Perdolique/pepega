import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { idStringAsNumberSchema } from '~~/server/utils/validation'
import { tables } from '~~/server/utils/database'
import { createError, defineEventHandler, getValidatedRouterParams, sendNoContent } from 'h3'

const paramsSchema = v.object({
  id: idStringAsNumberSchema
})

function idValidator(params: unknown) {
  return v.parse(paramsSchema, params)
}

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: channelId } = await getValidatedRouterParams(event, idValidator)

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
      statusCode: 404,
      message: 'Channel not found'
    })
  }

  return sendNoContent(event)
})
