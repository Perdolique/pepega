export const limits = {
  maxOAuthProviderTypeLength: 32,
  maxOAuthProviderNameLength: 32
} as const

export type ConfigKeys = 'maxTelegramChannelsPerUser'

export const configKeys = {
  maxTelegramChannelsPerUser: 'maxTelegramChannelsPerUser'
} as const satisfies Record<ConfigKeys, ConfigKeys>
