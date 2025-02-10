export const sessionCookieName = 'pepeger'

export const publicApiPaths = [
  '/api/oauth/twitch'
] as const

export const limits = {
  maxOAuthProviderTypeLength: 32,
  maxOAuthProviderNameLength: 32
} as const
