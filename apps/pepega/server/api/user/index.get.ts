import type { UserModel } from '~~/shared/models/user'

export default defineEventHandler(async (event) : Promise<UserModel> => {
  return await getSessionUser(event)
})
