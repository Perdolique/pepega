export const destinationKeys = {
  root: ['notification-destinations'],

  byNotificationId: (notificationId: number | undefined) => [
    ...destinationKeys.root,
    { notificationId }
  ]
} as const
