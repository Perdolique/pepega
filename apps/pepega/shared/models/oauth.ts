import type { User as TwitchUser } from '@pepega/twitch/models/general'

export type OAuthProvider = 'twitch'

export type OAuthUser<P extends OAuthProvider = OAuthProvider> = {
  provider: P;
  user:
    P extends 'twitch' ? TwitchUser : never;
}
