export interface TwitchUser {
  readonly id: string;
  readonly login: string;
  readonly display_name: string;
  readonly type: '' | 'staff' | 'admin' | 'global_mod';
  readonly broadcaster_type: '' | 'affiliate' | 'partner';
  readonly description: string;
  readonly profile_image_url: string;
  readonly offline_image_url: string;
  readonly created_at: string;
  // "user:read:email" scope required
  readonly email?: string;
}

interface TwitchOAuthTokenError {
  readonly status: number;
  readonly message: string;
}

interface TwitchOAuthToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly token_type: string;
  readonly scope?: string[];
}

export interface TwitchAppTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
  readonly token_type: string;
}

export type TwitchOAuthTokenResponse = TwitchOAuthToken | TwitchOAuthTokenError;

interface TwitchUsersError {
  readonly error: string;
  readonly status: number;
  readonly message: string;
}

interface TwitchUsers {
  readonly data: TwitchUser[];
}

export type TwitchUsersResponse = TwitchUsers | TwitchUsersError;

// EventSub subscription types
export type EventSubSubscriptionType = 'stream.online'
