import { destinationKeys } from '~/composables/keys/notification/destinations'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'

export const getByNotificationId = defineQueryOptions((notificationId: number) => ({
  key: destinationKeys.byNotificationId(notificationId),
  enabled: import.meta.client,

  query() {
    return $fetch<NotificationDestinationModel[]>('/api/notifications/destinations', {
      method: 'GET',

      query: {
        notificationId
      }
    })
  }
}))
