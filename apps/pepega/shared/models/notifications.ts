import type { StrictExtract } from 'ts-essentials'
import type { TelegramDestinationConfig } from '@pepega/database/types'
import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub'

export type NotificationEventType = StrictExtract<EventSubscriptionType, 'stream.online'>

export interface NotificationModel {
  id: number;
  isActive: boolean;
}

export interface NotificationDestinationModel {
  id: number;
  config: TelegramDestinationConfig;
  isActive: boolean;
}
