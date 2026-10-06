import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'
import { telegramQueryKeys } from '~/composables/keys/telegram'
import { captureQueryUser, isCurrentQueryUser } from '~/utils/query-client'
import { useUserStore } from '~/stores/user'
import { useIsMutating, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { $fetch } from 'ofetch'

const mutationKey = ['telegram', 'delete-channel'] as const

export function useDeleteTelegramChannel() {
  const queryClient = useQueryClient()
  const userStore = useUserStore()
  const pendingCount = useIsMutating({ mutationKey, exact: true })
  const isPending = computed(() => pendingCount.value > 0)

  const mutation = useMutation({
    mutationKey,

    mutationFn(channelId: number) {
      return $fetch<unknown>(`/api/telegram/channel/${channelId}`, {
        method: 'DELETE'
      })
    },

    async onMutate(channelId) {
      const userContext = captureQueryUser(queryClient, userStore.userId)
      const queryKey = telegramQueryKeys.channels()

      await queryClient.cancelQueries({ queryKey, exact: true })

      const previousChannels = queryClient.getQueryData<TelegramChannelModel[]>(queryKey)
      const isCurrentSession = isCurrentQueryUser(queryClient, userContext, userStore.userId)

      if (isCurrentSession && previousChannels !== undefined) {
        const filteredChannels = previousChannels.filter((channel) => channel.id !== channelId)

        queryClient.setQueryData(queryKey, filteredChannels)
      }

      return {
        userId: userContext.userId,
        session: userContext.session,
        previousChannels
      }
    },

    onError(_error, _channelId, context) {
      const isCurrentSession = isCurrentQueryUser(queryClient, context, userStore.userId)

      if (!isCurrentSession || context?.previousChannels === undefined) {
        return
      }

      const queryKey = telegramQueryKeys.channels()

      queryClient.setQueryData(queryKey, context.previousChannels)
    },

    // TanStack passes the saved mutation context as the fourth argument.
    // oxlint-disable-next-line eslint/max-params
    onSettled(_data, _error, _channelId, context) {
      const isCurrentSession = isCurrentQueryUser(queryClient, context, userStore.userId)

      if (!isCurrentSession) {
        return
      }

      const queryKey = telegramQueryKeys.channels()

      return queryClient.invalidateQueries({ queryKey })
    }
  })

  function deleteChannel(channelId: number) {
    const pendingDeletions = queryClient.isMutating({ mutationKey, exact: true })

    if (pendingDeletions > 0) {
      return
    }

    mutation.mutate(channelId)
  }

  return {
    mutate: deleteChannel,
    isPending,
    error: mutation.error
  }
}
