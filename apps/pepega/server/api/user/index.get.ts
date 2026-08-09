import type { UserModel } from '~~/shared/models/user'
import { getSessionUser } from '~~/server/utils/user'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) : Promise<UserModel> => {
  return await getSessionUser(event)
})
