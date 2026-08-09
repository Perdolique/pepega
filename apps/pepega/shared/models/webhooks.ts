import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub'

export type WebhookStatus = 'not_active' | 'active' | 'pending' | 'failed' | 'revoked'

export interface WebhookModel {
  id: number;
  status: WebhookStatus;
  type: EventSubscriptionType;
  createdAt: string;
}
