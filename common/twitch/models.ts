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

export type SubscriptionStatus =
  'enabled' |
  'webhook_callback_verification_pending' |
  'webhook_callback_verification_failed' |
  'notification_failures_exceeded' |
  'authorization_revoked' |
  'moderator_removed' |
  'user_removed' |
  'version_removed' |
  'beta_maintenance' |
  'websocket_disconnected' |
  'websocket_failed_ping_pong' |
  'websocket_received_inbound_traffic' |
  'websocket_connection_unused' |
  'websocket_internal_error' |
  'websocket_network_timeout' |
  'websocket_network_error'

// https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/
export type SubscriptionType =
  'automod.message.hold' |
  'automod.message.hold' |
  'automod.message.update' |
  'automod.message.update' |
  'automod.settings.update' |
  'automod.terms.update' |
  'channel.bits.use' |
  'channel.update' |
  'channel.follow' |
  'channel.ad_break.begin' |
  'channel.chat.clear' |
  'channel.chat.clear_user_messages' |
  'channel.chat.message' |
  'channel.chat.message_delete' |
  'channel.chat.notification' |
  'channel.chat_settings.update' |
  'channel.chat.user_message_hold' |
  'channel.chat.user_message_update' |
  'channel.shared_chat.begin' |
  'channel.shared_chat.update' |
  'channel.shared_chat.end' |
  'channel.subscribe' |
  'channel.subscription.end' |
  'channel.subscription.gift' |
  'channel.subscription.message' |
  'channel.cheer' |
  'channel.raid' |
  'channel.ban' |
  'channel.unban' |
  'channel.unban_request.create' |
  'channel.unban_request.resolve' |
  'channel.moderate' |
  'channel.moderate' |
  'channel.moderator.add' |
  'channel.moderator.remove' |
  'channel.guest_star_session.begin' |
  'channel.guest_star_session.end' |
  'channel.guest_star_guest.update' |
  'channel.guest_star_settings.update' |
  'channel.channel_points_automatic_reward_redemption.add' |
  'channel.channel_points_automatic_reward_redemption.add' |
  'channel.channel_points_custom_reward.add' |
  'channel.channel_points_custom_reward.update' |
  'channel.channel_points_custom_reward.remove' |
  'channel.channel_points_custom_reward_redemption.add' |
  'channel.channel_points_custom_reward_redemption.update' |
  'channel.poll.begin' |
  'channel.poll.progress' |
  'channel.poll.end' |
  'channel.prediction.begin' |
  'channel.prediction.progress' |
  'channel.prediction.lock' |
  'channel.prediction.end' |
  'channel.suspicious_user.message' |
  'channel.suspicious_user.update' |
  'channel.vip.add' |
  'channel.vip.remove' |
  'channel.warning.acknowledge' |
  'channel.warning.send' |
  'channel.charity_campaign.donate' |
  'channel.charity_campaign.start' |
  'channel.charity_campaign.progress' |
  'channel.charity_campaign.stop' |
  'conduit.shard.disabled' |
  'drop.entitlement.grant' |
  'extension.bits_transaction.create' |
  'channel.goal.begin' |
  'channel.goal.progress' |
  'channel.goal.end' |
  'channel.hype_train.begin' |
  'channel.hype_train.progress' |
  'channel.hype_train.end' |
  'channel.shield_mode.begin' |
  'channel.shield_mode.end' |
  'channel.shoutout.create' |
  'channel.shoutout.receive' |
  'stream.online' |
  'stream.offline' |
  'user.authorization.grant' |
  'user.authorization.revoke' |
  'user.update' |
  'user.whisper.message'

interface SubscriptionCondition {
  broadcaster_user_id: string;
}

interface SubscriptionTransport {
  method: 'webhook' | 'websocket';
  callback: string;
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  type: SubscriptionType;
  version: string;
  condition: SubscriptionCondition;
  created_at: string;
  transport: SubscriptionTransport;
  cost: number;
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
