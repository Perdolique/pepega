import { destinationKeys } from '~/composables/keys/notification/destinations'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'
import { defineQueryOptions } from '@pinia/colada'
import { $fetch } from 'ofetch'

export const getByNotificationId = defineQueryOptions((notificationId: number | undefined) => ({
  key: destinationKeys.byNotificationId(notificationId),
  enabled: import.meta.client && notificationId !== undefined,

  query() {
    if (notificationId === undefined) {
      throw new Error('Notification ID is required')
    }

    return $fetch<NotificationDestinationModel[]>('/api/notifications/destinations', {
      method: 'GET',

      query: {
        notificationId
      }
    })
  }
}))
