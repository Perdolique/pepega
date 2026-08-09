const limits = {
  maxOAuthProviderTypeLength: 32,
  maxOAuthProviderNameLength: 32,
} as const;

type ConfigKeys = 'maxTelegramChannelsPerUser';

const configKeys = {
  maxTelegramChannelsPerUser: 'maxTelegramChannelsPerUser',
} as const satisfies Record<ConfigKeys, ConfigKeys>;

export { limits, configKeys };
export type { ConfigKeys };
