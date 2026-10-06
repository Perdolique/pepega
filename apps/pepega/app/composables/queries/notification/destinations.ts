import { destinationKeys } from '~/composables/keys/notification/destinations'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'
import { queryOptions } from '@tanstack/vue-query'
import { $fetch } from 'ofetch'

export function getByNotificationId(notificationId: number) {
  return queryOptions({
    queryKey: destinationKeys.byNotificationId(notificationId),
    enabled: import.meta.client,

    queryFn({ signal }) {
      return $fetch<NotificationDestinationModel[]>('/api/notifications/destinations', {
        method: 'GET',
        signal,
        query: {
          notificationId
        }
      })
    }
  })
}
