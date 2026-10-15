import type { ApiRequestEvent } from '#shared/types/api-request'
import { parseRouterParams } from '~~/server/utils/request-validation'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import type { UserModel } from '~~/shared/models/user'
import { tables } from '~~/server/utils/database'
import { createError, defineEventHandler, readValidatedBody } from 'nuxt/server'
import logger from '~~/server/utils/logger'

const paramsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.nonEmpty()
  )
})

const bodySchema = v.object({
  isStreamer: v.boolean()
})

export default defineEventHandler(async (
  event: ApiRequestEvent<{ body: v.InferInput<typeof bodySchema> }>
) : Promise<UserModel> => {
  const { userId, db } = event.context
  const { id: paramsUserId } = parseRouterParams(event, paramsSchema)

  if (paramsUserId !== userId) {
    logger.error('For some reason, the userId in the params is not the same as the one in the session')

    throw createError({
      status: 403,
      statusText: 'Forbidden'
    })
  }

  const { isStreamer } = await readValidatedBody(event, bodySchema)

  const [updatedUser] = await db
    .update(tables.users)
    .set({
      isStreamer
    })
    .where(
      eq(tables.users.id, paramsUserId)
    )
    .returning({
      id: tables.users.id,
      isStreamer: tables.users.isStreamer,
      isAdmin: tables.users.isAdmin
    })

  if (updatedUser === undefined) {
    logger.error('User not found')

    throw createError({
      status: 404,
      statusText: 'Not Found'
    })
  }

  return updatedUser
})
