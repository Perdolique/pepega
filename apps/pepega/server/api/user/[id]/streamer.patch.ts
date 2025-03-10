import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import type { UserModel } from '~~/shared/models/user'

const paramsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.nonEmpty()
  )
})

const bodySchema = v.object({
  isStreamer: v.boolean()
})

function userIdValidator(params: unknown) {
  return v.parse(paramsSchema, params)
}

function bodyValidator(body: unknown) {
  return v.parse(bodySchema, body)
}

export default defineEventHandler(async (event) : Promise<UserModel> => {
  const { userId, db } = event.context
  const { id: paramsUserId } = await getValidatedRouterParams(event, userIdValidator)

  if (paramsUserId !== userId) {
    logger.error('For some reason, the userId in the params is not the same as the one in the session')

    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  const { isStreamer } = await readValidatedBody(event, bodyValidator)

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
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  }

  return updatedUser
})
