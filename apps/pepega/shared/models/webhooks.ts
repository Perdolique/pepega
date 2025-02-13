import type { EventSubSubscriptionType } from './twitch'

export type WebhookStatus = 'not_active' | 'active' | 'pending' | 'failed' | 'revoked'

export interface WebhookModel {
  id: number;
  status: WebhookStatus;
  type: EventSubSubscriptionType;
  createdAt: string;
}
