import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub';

type WebhookStatus = 'not_active' | 'active' | 'pending' | 'failed' | 'revoked';

interface WebhookModel {
  id: number;
  status: WebhookStatus;
  type: EventSubscriptionType;
  createdAt: string;
}

export type { WebhookStatus, WebhookModel };
