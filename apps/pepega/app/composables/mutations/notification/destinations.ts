import { destinationKeys } from '~/composables/keys/notification/destinations'
import type { NotificationDestinationModel } from '~~/shared/models/notifications'
import { captureQueryUser, isCurrentQueryUser } from '~/utils/query-client'
import { useUserStore } from '~/stores/user'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { $fetch } from 'ofetch'

interface CreateTelegramNotificationParams {
  notificationId: number;
  message: string;
  telegramChannelId: number;
}

export function useCreateTelegramNotification() {
  const queryClient = useQueryClient()
  const userStore = useUserStore()

  const { mutate: createNotification, ...mutation } = useMutation({
    mutationFn({ telegramChannelId, message, notificationId }: CreateTelegramNotificationParams) {
      return $fetch<NotificationDestinationModel>('/api/notifications/destinations', {
        method: 'POST',
        body: { notificationId, message, telegramChannelId }
      })
    },

    onMutate() {
      return captureQueryUser(queryClient, userStore.userId)
    },

    async onSuccess(data, { notificationId }, context) {
      if (!isCurrentQueryUser(queryClient, context, userStore.userId)) {
        return
      }

      const queryKey = destinationKeys.byNotificationId(notificationId)

      await queryClient.cancelQueries({ queryKey, exact: true })

      if (!isCurrentQueryUser(queryClient, context, userStore.userId)) {
        return
      }

      queryClient.setQueryData<NotificationDestinationModel[]>(queryKey, (existingDestinations) => {
        if (existingDestinations === undefined) {
          return
        }

        const alreadyExists = existingDestinations.some((destination) => destination.id === data.id)

        if (alreadyExists) {
          return existingDestinations
        }

        return [...existingDestinations, data]
      })

      return queryClient.invalidateQueries({ queryKey, exact: true })
    }
  })

  return { createNotification, ...mutation }
}
