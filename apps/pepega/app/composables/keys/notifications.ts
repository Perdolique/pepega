import type { NotificationEventType } from '~~/shared/models/notifications'

export const notificationKeys = {
  root: ['notifications'],
  byEventType: (type: NotificationEventType) => [...notificationKeys.root, { eventType: type }],
} as const
