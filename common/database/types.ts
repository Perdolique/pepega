export type NotificationProviderType = 'telegram'

/**
 * Notification configuration types 🔥
 * Polymorphic types for different providers
 */
export interface TelegramDestinationConfig {
  type: 'telegram';
}

export type NotificationDestinationConfig = TelegramDestinationConfig
