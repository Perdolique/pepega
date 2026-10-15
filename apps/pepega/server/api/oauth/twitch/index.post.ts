import type { ApiRequestEvent } from '#shared/types/api-request'
import { getOAuthToken, getUserInfo } from '@pepega/twitch/auth'
import * as v from 'valibot'
import type { UserModel } from '~~/shared/models/user'
import { getTwitchRedirectUri } from '~~/server/utils/provider-twitch'
import { updateAppSession } from '~~/server/utils/session'
import { createOAuthUser, getSessionUser, getUserByOAuthAccount } from '~~/server/utils/user'
import { getValidatedTwitchClientId, getValidatedTwitchClientSecret } from '~~/server/utils/validation'
import { createError, defineEventHandler, readValidatedBody } from 'nuxt/server'

const bodySchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty())
})
export default defineEventHandler(async (
  event: ApiRequestEvent<{ body: v.InferInput<typeof bodySchema> }>
) : Promise<UserModel> => {
  const currentUser = await getSessionUser(event)

  // User already logged in
  if (currentUser.id !== null) {
    // TODO: Link the Twitch account to the current user

    throw createError({
      message: 'Not implemented',
      status: 501
    })
  }

  const { code } = await readValidatedBody(event, bodySchema)
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
      status: 500
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
      status: 500
    })
  }

  const foundUser = await getUserByOAuthAccount(event, 'twitch', userInfo.id)

  // Twitch account not linked to any user
  if (foundUser.id === null) {
    // Create a new user with the OAuth account
    const newUser = await createOAuthUser({
      provider: 'twitch',
      user: userInfo
    })

    await updateAppSession(event, {
      userId: newUser.id,
      isAdmin: newUser.isAdmin
    })

    return newUser
  }

  // User already linked their Twitch account
  await updateAppSession(event, {
    userId: foundUser.id,
    isAdmin: foundUser.isAdmin
  })

  return foundUser
})
