import type { StrictExtract } from 'ts-essentials';
import type { TelegramDestinationConfig } from '@pepega/database/types';
import type { EventSubscriptionType } from '@pepega/twitch/models/event-sub';

type NotificationEventType = StrictExtract<EventSubscriptionType, 'stream.online'>;

interface NotificationModel {
  id: number;
  isActive: boolean;
}

interface NotificationDestinationModel {
  id: number;
  config: TelegramDestinationConfig;
  isActive: boolean;
}

export type { NotificationEventType, NotificationModel, NotificationDestinationModel };
