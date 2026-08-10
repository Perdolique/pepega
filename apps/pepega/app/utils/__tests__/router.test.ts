import { encodeStateData } from '@pepega/twitch/auth'
import {
  getOAuthRedirectTo,
  getRedirectTo,
  getTwitchAuthorizationPath
} from '../router'
import { describe, expect, it } from 'vitest'

describe('oauth routing', () => {
  it('preserves and encodes redirectTo for Twitch authorization', () => {
    const redirectTo = '/settings/notifications/stream-online?tab=telegram&mode=edit'
    const path = getTwitchAuthorizationPath(getRedirectTo(redirectTo))

    expect(path).toBe(
      '/api/oauth/twitch?redirectTo=%2Fsettings%2Fnotifications%2Fstream-online%3Ftab%3Dtelegram%26mode%3Dedit'
    )
  })

  it('starts a new authorization with redirectTo from callback state', () => {
    const redirectTo = '/notifications?from=account'
    const state = encodeStateData({ redirectTo })
    const callbackRedirectTo = getOAuthRedirectTo(state)

    expect(getTwitchAuthorizationPath(callbackRedirectTo)).toBe(
      '/api/oauth/twitch?redirectTo=%2Fnotifications%3Ffrom%3Daccount'
    )
  })

  it('falls back to the dashboard when callback state is missing', () => {
    expect(getOAuthRedirectTo(undefined)).toBe('/dashboard')
  })
})
