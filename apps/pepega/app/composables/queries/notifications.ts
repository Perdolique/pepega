import { defineQueryOptions } from '@pinia/colada'
import type { NotificationEventType, NotificationModel } from '~~/shared/models/notifications'
import { notificationKeys } from '../keys/notifications'

export const getNotificationByType = defineQueryOptions((eventType: NotificationEventType) => ({
  key: notificationKeys.byEventType(eventType),
  enabled: import.meta.client,

  query() {
    return $fetch<NotificationModel>('/api/notifications', {
      method: 'GET',

      query: {
        type: eventType
      }
    })
  }
}))

