import { type RequestEvent, error } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { redirectUrlParam } from '$lib/constants'
import { users } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

import type {
  TwitchOAuthTokenResponse,
  TwitchUser,
  TwitchUsersResponse
} from '$lib/models/twitch'

export function getTwitchRedirectUri(event: RequestEvent) : string {
  const twitchRedirectUrl = new URL(event.url.origin)

  twitchRedirectUrl.pathname = '/auth/twitch'

  return twitchRedirectUrl.toString()
}

export function getTwitchAuthUrl(event: RequestEvent) : string {
  /**
   * TODO: Check if the user is already logged in and linked their account
   *
   * https://github.com/Perdolique/pepega/issues/27
   * https://www.youtube.com/watch?v=dQw4w9WgXcQ
   */

  if (env.OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    error(500, 'Internal server error')
  }

  const redirectUri = getTwitchRedirectUri(event)
  const authUrl = new URL('https://id.twitch.tv/oauth2/authorize')

  // TODO: Add `state` to prevent CSRF attacks
  // https://github.com/Perdolique/pepega/issues/28
  authUrl.searchParams.set('client_id', env.OAUTH_TWITCH_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')

  return authUrl.toString()
}

export async function getTwitchOAuthToken(event: RequestEvent, code: string) : Promise<string> {
  const {
    OAUTH_TWITCH_CLIENT_ID,
    OAUTH_TWITCH_CLIENT_SECRET
  } = env

  if (OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    throw new Error('Internal server error')
  }

  if (OAUTH_TWITCH_CLIENT_SECRET === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_SECRET is not defined')

    throw new Error('Internal server error')
  }

  const redirectUri = getTwitchRedirectUri(event)

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      client_id: OAUTH_TWITCH_CLIENT_ID,
      client_secret: OAUTH_TWITCH_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    })
  })

  const tokenResponse : TwitchOAuthTokenResponse = await response.json()

  if ('status' in tokenResponse) {
    throw new Error(tokenResponse.message)
  }

  return tokenResponse.access_token
}

export async function getTwitchUserInfo(accessToken: string) : Promise<TwitchUser> {
  const { OAUTH_TWITCH_CLIENT_ID } = env

  if (OAUTH_TWITCH_CLIENT_ID === undefined) {
    console.error('OAUTH_TWITCH_CLIENT_ID is not defined')

    throw new Error('Internal server error')
  }

  const response = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-ID': OAUTH_TWITCH_CLIENT_ID
    }
  })

  const users : TwitchUsersResponse = await response.json()

  if ('error' in users) {
    throw new Error(users.message)
  }

  if (users.data[0] === undefined) {
    throw new Error('No user data found')
  }

  return users.data[0]
}

export async function storeTwitchNickname(db, userId: string, nickname: string) {
  await db.update(users)
    .set({ nickname })
    .where(eq(users.id, userId))
}
