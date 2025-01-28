export const sessionCookieName = 'pepeger'

export const publicApiPaths = [
  '/api/oauth/twitch'
] as const

export const limits = {
  maxOAuthProviderTypeLength: 32,
  maxOAuthProviderNameLength: 32
} as const

export const webhooksWorkerBaseUrls = {
  development: 'http://localhost:8788',
  staging: 'https://pooque-staging.pepega.app',
  production: 'https://pooque.pepega.app'
} as const
