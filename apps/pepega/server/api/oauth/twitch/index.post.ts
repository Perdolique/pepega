import { getOAuthToken, getUserInfo } from '@pepega/twitch/auth'
import * as v from 'valibot'
import type { UserModel } from '~~/shared/models/user'

const bodySchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty())
})
function validateBody(body: unknown) {
  return v.parse(bodySchema, body)
}

export default defineEventHandler(async (event) : Promise<UserModel> => {
  const currentUser = await getSessionUser(event)

  // User already logged in
  if (currentUser.id !== null) {
    // TODO: Link the Twitch account to the current user

    throw createError({
      message: 'Not implemented',
      statusCode: 501
    })
  }

  const { code } = await readValidatedBody(event, validateBody)
  const clientId = getValidatedTwitchClientId()
  const clientSecret = getValidatedTwitchClientSecret()
  const redirectUri = getTwitchRedirectUri(event)

  const accessToken = await getOAuthToken({
    code,
    clientId,
    clientSecret,
    redirectUri
  })

  if (accessToken === null) {
    throw createError({
      message: 'Failed to get Twitch OAuth token',
      statusCode: 500
    })
  }

  const usersInfo = await getUserInfo({
    clientId,
    accessToken
  })

  const userInfo = usersInfo?.[0]

  if (userInfo === undefined) {
    throw createError({
      message: 'Failed to get Twitch user info',
      statusCode: 500
    })
  }

  const foundUser = await getUserByOAuthAccount(event, 'twitch', userInfo.id)

  // Twitch account not linked to any user
  if (foundUser.id === null) {
    // Create a new user with the OAuth account
    const newUser = await createOAuthUser('twitch', userInfo.id)

    await updateAppSession(event, newUser)

    return newUser
  }

  // User already linked their Twitch account
  await updateAppSession(event, {
    userId: foundUser.id,
    isAdmin: foundUser.isAdmin
  })

  return foundUser
})
