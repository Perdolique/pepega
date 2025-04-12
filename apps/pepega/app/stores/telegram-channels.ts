import type { TelegramChannelModel } from '~~/shared/models/telegram-channels'

export const useTelegramChannelsStore = defineStore('telegram-channels', () => {
  const queryCache = useQueryCache()
  const telegramChannelsCacheKey = ['telegram-channels']

  const { state: channels, isPending: isGettingChannels } = useQuery({
    key: telegramChannelsCacheKey,

    query() {
      // FIXME: https://github.com/nitrojs/nitro/issues/2758
      return $fetch<TelegramChannelModel[]>('/api/telegram/channel', {
        method: 'GET'
      })
    },

    enabled: import.meta.client
  })

  const { mutate: addChannel, isLoading: isAddingChannel } = useMutation({
    mutation(chatId: string) {
      return $fetch<TelegramChannelModel>('/api/telegram/channel', {
        method: 'POST',

        body: {
          chatId
        }
      })
    },

    async onSettled() {
      return await queryCache.invalidateQueries({
        key: telegramChannelsCacheKey
      })
    }
  })

  const { mutate: deleteChannel, isLoading: isDeletingChannel } = useMutation({
    mutation(channelId: number) {
      return $fetch<unknown>(`/api/telegram/channel/${channelId}`, {
        method: 'DELETE'
      })
    },

    async onMutate(channelId: number) {
      const previousChannels = queryCache.getQueryData<TelegramChannelModel[]>(telegramChannelsCacheKey)
      const channelsWithoutDeleted = previousChannels?.filter((channel) => channel.id !== channelId)

      queryCache.setQueryData(telegramChannelsCacheKey, channelsWithoutDeleted)
      queryCache.cancelQueries({ key: telegramChannelsCacheKey })

      return {
        previousChannels
      }
    },

    onError(error, channelId, { previousChannels }) {
      queryCache.setQueryData(telegramChannelsCacheKey, previousChannels)
    },

    onSettled() {
      return queryCache.invalidateQueries({
        key: telegramChannelsCacheKey
      })
    }
  })

  return {
    channels,
    isGettingChannels,
    isAddingChannel,
    addChannel,
    deleteChannel,
    isDeletingChannel
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useTelegramChannelsStore, import.meta.hot)
  )
}
