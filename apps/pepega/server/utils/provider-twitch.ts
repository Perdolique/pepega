import { H3Event } from 'h3'

export function getTwitchRedirectUri(event: H3Event) : string {
  const url = getRequestURL(event)
  const twitchRedirectUrl = new URL(url.origin)

  twitchRedirectUrl.pathname = '/auth/twitch'

  return twitchRedirectUrl.toString()
}
