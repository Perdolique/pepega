export type EventMessageType = 'notification' | 'webhook_callback_verification' | 'revocation'
export type StreamType = 'live' | 'playlist' | 'watch_party' | 'premiere' | 'rerun'
export type TransportMethod = 'webhook' | 'websocket'

/**
 * {@link https://dev.twitch.tv/docs/eventsub/manage-subscriptions/#filtering-the-list-by-status}
 */
export type EventSubscriptionStatus =
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

/**
 * {@link https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/}
 */
export type EventSubscriptionType =
  'automod.message.hold' |
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
  'channel.moderator.add' |
  'channel.moderator.remove' |
  'channel.guest_star_session.begin' |
  'channel.guest_star_session.end' |
  'channel.guest_star_guest.update' |
  'channel.guest_star_settings.update' |
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

interface StreamOnlineEvent {
  id: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  type: StreamType;
  started_at: string;
}

type NotificationEvent = StreamOnlineEvent;

interface StreamOnlineCondition {
  broadcaster_user_id: string;
}

// TODO: Add more conditions as needed.
/**
 * Conditions for an EventSub subscription.
 *
 * {@link https://dev.twitch.tv/docs/eventsub/eventsub-reference/#conditions}
 */
type SubscriptionConditions = StreamOnlineCondition;

/**
 * {@link https://dev.twitch.tv/docs/eventsub/eventsub-reference/#transport}
 */
interface EventTransport {
  method: TransportMethod;
  callback?: string;
  secret?: string;
  session_id?: string;
  connected_at?: string;
  disconnected_at?: string;
}

/**
 * {@link https://dev.twitch.tv/docs/eventsub/eventsub-reference/#subscription}
 */
export interface EventSubscription {
  id: string;
  status: EventSubscriptionStatus;
  type: EventSubscriptionType;
  version: string;
  /** How much the subscription counts against your limit. See [Subscription Limits](https://dev.twitch.tv/docs/eventsub/manage-subscriptions#subscription-limits) for more information. */
  cost: number;
  condition: SubscriptionConditions;
  transport: EventTransport;
  created_at: string;
}

/** Base interface for all EventSub notifications. */
interface EventNotification {
  event: NotificationEvent;
  subscription: EventSubscription;
}

interface StreamOnlineSubscription extends EventSubscription {
  condition: StreamOnlineCondition;
  type: 'stream.online';
}

/**
 * Payload for a Stream Online notification.
 *
 * {@link https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#streamonline}
 */
export interface StreamOnlineNotification extends EventNotification {
  subscription: StreamOnlineSubscription;
  event: StreamOnlineEvent;
}
