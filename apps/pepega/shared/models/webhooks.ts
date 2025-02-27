import type { SubscriptionType } from '@pepega/twitch/models'

export type WebhookStatus = 'not_active' | 'active' | 'pending' | 'failed' | 'revoked'

export interface WebhookModel {
  id: number;
  status: WebhookStatus;
  type: SubscriptionType;
  createdAt: string;
}
