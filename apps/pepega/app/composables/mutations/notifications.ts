import type { NotificationEventType, NotificationModel } from '~~/shared/models/notifications'
import { notificationKeys } from '../keys/notifications'

/**
 *  Composable to initialize notifications for a specific event type.
 */
export const useInitNotifications = defineMutation(() => {
  const cache = useQueryCache()

  const { mutate, ...mutation } = useMutation({
    mutation(eventType: NotificationEventType) {
      return $fetch<NotificationModel>('/api/notifications', {
        method: 'POST',
        body: { eventType }
      })
    },

    onSuccess(data, eventType) {
      const { id, isActive } = data

      cache.setQueryData<NotificationModel>(notificationKeys.byEventType(eventType), {
        id,
        isActive
      })
    }
  })

  function initNotifications(eventType: NotificationEventType) {
    return mutate(eventType)
  }

  return {
    initNotifications,
    ...mutation
  }
})

/**
 * Composable to delete a notification for a specific event type.
 */
export const useDeleteNotification = defineMutation(() => {
  const cache = useQueryCache()

  const { mutate, ...mutation } = useMutation({
    mutation(eventType: NotificationEventType) {
      return $fetch<void>(`/api/notifications/${eventType}`, {
        method: 'DELETE'
      })
    },

    onSuccess(data, eventType) {
      cache.setQueryData(notificationKeys.byEventType(eventType), undefined)
    }
  })

  function deleteNotification(eventType: NotificationEventType) {
    return mutate(eventType)
  }

  return {
    deleteNotification,
    ...mutation
  }
})
