import type { User as TwitchUser } from '@pepega/twitch/models/general';

type OAuthProvider = 'twitch';

interface OAuthUser<P extends OAuthProvider = OAuthProvider> {
  provider: P;
  user: P extends 'twitch' ? TwitchUser : never;
}

export type { OAuthProvider, OAuthUser };
