import { destinationKeys } from '~/composables/keys/notification/destinations'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'

interface CreateTelegramNotificationParams {
  notificationId: number;
  message: string;
  telegramChannelId: number;
}

/**
 * Composable to create a specific notification for a given event type and destination.
 */
export const useCreateTelegramNotification = defineMutation(() => {
  const cache = useQueryCache()

  const { mutate, ...mutation } = useMutation({
    mutation({ telegramChannelId, message, notificationId } : CreateTelegramNotificationParams) {
      return $fetch<NotificationDestinationModel>('/api/notifications/destinations', {
        method: 'POST',

        body: {
          notificationId,
          message,
          telegramChannelId
        }
      })
    },

    onSuccess(data, { notificationId }) {
      const existingDestinations = cache.getQueryData<NotificationDestinationModel[]>(
        destinationKeys.byNotificationId(notificationId)
      ) || []

      cache.setQueryData<NotificationDestinationModel[]>(destinationKeys.byNotificationId(notificationId), [
        ...existingDestinations,
        data
      ])
    }
  })

  function createNotification(params : CreateTelegramNotificationParams) {
    return mutate(params)
  }

  return {
    createNotification,
    ...mutation
  }
})
