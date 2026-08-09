type NotificationProviderType = 'telegram';

/**
 * Notification configuration types 🔥
 * Polymorphic types for different providers
 */
interface TelegramDestinationConfig {
  type: 'telegram';
}

type NotificationDestinationConfig = TelegramDestinationConfig;

export type { NotificationProviderType, TelegramDestinationConfig, NotificationDestinationConfig };
