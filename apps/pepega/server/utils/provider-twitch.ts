import { type RequestEvent, getRequestURL } from 'nuxt/server'

export function getTwitchRedirectUri(event: RequestEvent) : string {
  const url = getRequestURL(event)
  const twitchRedirectUrl = new URL(url.origin)

  twitchRedirectUrl.pathname = '/auth/twitch'

  return twitchRedirectUrl.toString()
}
