import { queryOptions } from '@tanstack/vue-query'
import type { NotificationEventType, NotificationModel } from '~~/shared/models/notifications'
import { notificationKeys } from '~/composables/keys/notifications'
import { $fetch, FetchError } from 'ofetch'

export function getNotificationByType(eventType: NotificationEventType) {
  return queryOptions({
    queryKey: notificationKeys.byEventType(eventType),
    enabled: import.meta.client,

    async queryFn({ signal }): Promise<NotificationModel | null> {
      try {
        return await $fetch<NotificationModel>('/api/notifications', {
          method: 'GET',
          signal,
          query: {
            type: eventType
          }
        })
      } catch (error) {
        if (error instanceof FetchError && error.statusCode === 404) {
          return null
        }

        throw error
      }
    }
  })
}
