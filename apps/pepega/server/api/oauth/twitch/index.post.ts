import * as v from 'valibot'
import type { UserModel } from '~~/shared/models/user'

const bodySchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty())
})
function validateBody(body: unknown) {
  return v.parse(bodySchema, body)
}

export default defineEventHandler(async (event) : Promise<UserModel> => {
  const { code } = await readValidatedBody(event, validateBody)
  const token = await getTwitchOAuthToken(event, code)
  const { id: twitchAccountId } = await getTwitchUserInfo(token)
  const currentUser = await getSessionUser(event)

  // Not logged in
  if (currentUser.id === null) {
    const foundUser = await getUserByOAuthAccount(event, 'twitch', twitchAccountId)

    // Twitch account not linked to any user
    if (foundUser.id === null) {
      // Create a new user with the OAuth account
      const newUser = await createOAuthUser('twitch', twitchAccountId)

      await updateAppSession(event, newUser)

      return newUser
    }

    // User already linked their Twitch account
    await updateAppSession(event, {
      userId: foundUser.id,
      isAdmin: foundUser.isAdmin
    })

    return foundUser
  }

  // TODO: Link the Twitch account to the current user

  throw createError({
    message: 'Not implemented',
    statusCode: 501
  })
})
