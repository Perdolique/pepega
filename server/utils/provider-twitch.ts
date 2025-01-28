import { Buffer } from 'buffer'
import { H3Event } from 'h3'
import * as v from 'valibot'

import type {
  TwitchAppTokenResponse,
  TwitchOAuthTokenResponse,
  TwitchUser,
  TwitchUsersResponse
} from '~~/shared/models/twitch'

const stateDataSchema = v.object({
  redirectTo: v.string()
})

export function encodeStateData(data: Record<string, string>) : string {
  const stateString = JSON.stringify(data)
  const state = Buffer.from(stateString).toString('base64')

  return state
}

export function decodeStateData(state: unknown) {
  try {
    if (typeof state !== 'string') {
      return null
    }

    const stateString = Buffer.from(state, 'base64').toString('utf-8')
    const data = JSON.parse(stateString)
    const stateData = v.parse(stateDataSchema, data)

    return stateData
  } catch (error) {
    return null
  }
}

export function getTwitchRedirectUri(event: H3Event) : string {
  const url = getRequestURL(event)
  const twitchRedirectUrl = new URL(url.origin)

  twitchRedirectUrl.pathname = '/auth/twitch'

  return twitchRedirectUrl.toString()
}

/**
 * Get the URL to redirect the user to for Twitch authentication
 *
 * @param stateData - Data to be passed to the state parameter
 * @returns The URL to redirect the user to
 */
export function getTwitchAuthUrl(event: H3Event, stateData?: Record<string, string>) : string {
  /**
   * TODO: Check if the user is already logged in and linked their account
   *
   * https://github.com/Perdolique/pepega/issues/27
   * https://www.youtube.com/watch?v=dQw4w9WgXcQ
   */

  const { OAUTH_TWITCH_CLIENT_ID } = process.env

  if (OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }

  const redirectUri = getTwitchRedirectUri(event)
  const authUrl = new URL('https://id.twitch.tv/oauth2/authorize')

  // TODO: Add `state` to prevent CSRF attacks
  // https://github.com/Perdolique/pepega/issues/28

  authUrl.searchParams.set('client_id', OAUTH_TWITCH_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')

  if (stateData !== undefined) {
    const state = encodeStateData(stateData)

    authUrl.searchParams.set('state', state)
  }

  return authUrl.toString()
}

export async function getTwitchOAuthToken(event: H3Event, code: string) : Promise<string> {
  const {
    OAUTH_TWITCH_CLIENT_ID,
    OAUTH_TWITCH_CLIENT_SECRET
  } = process.env

  if (OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }

  if (OAUTH_TWITCH_CLIENT_SECRET === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_SECRET is not defined')

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }

  const redirectUri = getTwitchRedirectUri(event)

  const response = await $fetch<TwitchOAuthTokenResponse>('https://id.twitch.tv/oauth2/token', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: {
      client_id: OAUTH_TWITCH_CLIENT_ID,
      client_secret: OAUTH_TWITCH_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }
  })

  if ('status' in response) {
    throw createError({
      statusCode: response.status,
      message: response.message
    })
  }

  return response.access_token
}

export async function getTwitchUserInfo(accessToken: string) : Promise<TwitchUser> {
  const { OAUTH_TWITCH_CLIENT_ID } = process.env

  if (OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }

  const response = await $fetch<TwitchUsersResponse>('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-ID': OAUTH_TWITCH_CLIENT_ID
    }
  })

  if ('error' in response) {
    throw createError({
      statusCode: response.status,
      message: response.message
    })
  }

  if (response.data[0] === undefined) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  return response.data[0]
}

export async function getAppAccessToken() : Promise<TwitchAppTokenResponse> {
  const {
    OAUTH_TWITCH_CLIENT_ID,
    OAUTH_TWITCH_CLIENT_SECRET
  } = process.env

  // TODO: Check only once on app startup
  if (OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }

  if (OAUTH_TWITCH_CLIENT_SECRET === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_SECRET is not defined')

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }

  try {
    const response = await $fetch<TwitchAppTokenResponse>('https://id.twitch.tv/oauth2/token', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: {
        client_id: OAUTH_TWITCH_CLIENT_ID,
        client_secret: OAUTH_TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    })

    return response
  } catch (error) {
    console.error('Failed to get app access token', error)

    throw createError({
      statusCode: 500
    })
  }
}
