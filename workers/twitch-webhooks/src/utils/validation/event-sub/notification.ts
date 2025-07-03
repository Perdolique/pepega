import * as v from 'valibot'
import { UnionToTuple } from '@pepega/utils/types'

import {
  EventSubscriptionStatus,
  EventSubscriptionType,
  StreamType,
  TransportMethod
} from '@pepega/twitch/models/event-sub'

const eventSubscriptionStatusSchema = v.picklist<UnionToTuple<EventSubscriptionStatus>>([
  'enabled',
  'webhook_callback_verification_pending',
  'webhook_callback_verification_failed',
  'notification_failures_exceeded',
  'authorization_revoked',
  'moderator_removed',
  'user_removed',
  'version_removed',
  'beta_maintenance',
  'websocket_disconnected',
  'websocket_failed_ping_pong',
  'websocket_received_inbound_traffic',
  'websocket_connection_unused',
  'websocket_internal_error',
  'websocket_network_timeout',
  'websocket_network_error'
])

const transportMethodSchema = v.picklist<UnionToTuple<TransportMethod>>([
  'webhook',
  'websocket'
])

const streamTypeSchema = v.picklist<UnionToTuple<StreamType>>([
  'live',
  'playlist',
  'watch_party',
  'premiere',
  'rerun'
])

const conditionSchema = v.object({
  broadcaster_user_id: v.string()
})

const transportSchema = v.object({
  method: transportMethodSchema,
  callback: v.string()
})

const subscriptionSchema = v.object({
  id: v.string(),
  status: eventSubscriptionStatusSchema,
  type: v.literal('stream.online' satisfies EventSubscriptionType),
  version: v.string(),
  cost: v.number(),
  condition: conditionSchema,
  transport: transportSchema,
  created_at: v.string()
})

const eventSchema = v.object({
  id: v.string(),
  broadcaster_user_id: v.string(),
  broadcaster_user_login: v.string(),
  broadcaster_user_name: v.string(),
  type: streamTypeSchema,
  started_at: v.string()
})

export const streamOnlineNotificationSchema = v.object({
  subscription: subscriptionSchema,
  event: eventSchema
})
