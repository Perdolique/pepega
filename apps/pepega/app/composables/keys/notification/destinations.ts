export const destinationKeys = {
  root: ['notification-destinations'],

  byNotificationId: (notificationId: number) => [
    ...destinationKeys.root,
    { notificationId }
  ]
} as const
