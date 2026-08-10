import type { RouteLocationNormalized } from 'vue-router'
import { decodeStateData } from '@pepega/twitch/auth'

export function shouldSkipAuth(to: RouteLocationNormalized) {
  return to.meta.skipAuth === true
}

export function getRedirectTo(queryValue: unknown) : string | undefined {
  return typeof queryValue === 'string' ? queryValue : undefined
}

export function getOAuthRedirectTo(state: unknown) : string {
  return decodeStateData(state)?.redirectTo ?? '/dashboard'
}

export function getTwitchAuthorizationPath(redirectTo?: string) : string {
  if (redirectTo === undefined) {
    return '/api/oauth/twitch'
  }

  const search = new URLSearchParams({ redirectTo })

  return `/api/oauth/twitch?${search}`
}
