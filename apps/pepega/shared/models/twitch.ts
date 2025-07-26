import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub'

export interface SubscriptionModel {
  id: string;
  type: EventSubscriptionType;
  broadcasterId: string;
  streamerName: string | null;
  streamerLogin: string | null;
}
