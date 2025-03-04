import { H3Event } from 'h3'
import * as v from 'valibot'

const stateDataSchema = v.object({
  redirectTo: v.string()
})

export function encodeStateData(data: Record<string, string>) : string {
  const stateString = JSON.stringify(data)
  return btoa(stateString)
}

export function decodeStateData(state: unknown) {
  try {
    if (typeof state !== 'string') {
      return null
    }

    const stateString = atob(state)
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
