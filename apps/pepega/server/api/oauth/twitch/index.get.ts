import { getTwitchAuthUrl } from "~~/server/utils/provider-twitch"

export default defineEventHandler(async (event) => {
  // TODO: Check if the user is already logged in and linked their account
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ

  const { OAUTH_TWITCH_CLIENT_ID } = process.env

  if (OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }

  const { redirectTo } = getQuery(event)
  const stateData = typeof redirectTo === 'string' ? { redirectTo } : undefined
  const redirectUri = getTwitchAuthUrl(event, stateData)

  sendRedirect(event, redirectUri)
})
