export interface AppTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
  readonly token_type: string;
}

interface Pagination {
  cursor: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
  total: number;
  total_cost: number;
  max_total_cost: number;
}

export interface User {
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

interface UsersError {
  readonly error: string;
  readonly status: number;
  readonly message: string;
}

interface Users {
  readonly data: User[];
}

export type UsersResponse = Users | UsersError;

interface OAuthToken {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token: string;
  readonly token_type: string;
  readonly scope?: string[];
}

interface OAuthTokenError {
  readonly status: number;
  readonly message: string;
}

export type OAuthTokenResponse = OAuthToken | OAuthTokenError;
