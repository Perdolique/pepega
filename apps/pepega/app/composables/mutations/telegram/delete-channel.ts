import { defineMutation, useMutation, useQueryCache } from '@pinia/colada';
import { $fetch } from 'ofetch';
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels';
import { telegramQueryKeys } from '~/composables/keys/telegram';

export const useDeleteTelegramChannel = defineMutation(() => {
  const queryCache = useQueryCache();

  return useMutation({
    async mutation(channelId: number) {
      return $fetch<unknown>(`/api/telegram/channel/${channelId}`, {
        method: 'DELETE',
      });
    },

    onMutate(channelId: number) {
      const channelsKey = telegramQueryKeys.channels();
      const previousChannels = queryCache.getQueryData<TelegramChannelModel[]>(channelsKey);
      const filteredChannels = previousChannels?.filter((channel) => channel.id !== channelId);

      queryCache.setQueryData(channelsKey, filteredChannels);

      queryCache.cancelQueries({
        key: channelsKey,
      });

      return { previousChannels };
    },

    onError(_error, _channelId, { previousChannels }) {
      const channelsKey = telegramQueryKeys.channels();

      queryCache.setQueryData(channelsKey, previousChannels);
    },

    async onSettled() {
      const channelsKey = telegramQueryKeys.channels();

      const invalidateOptions = {
        key: channelsKey,
      };

      return queryCache.invalidateQueries(invalidateOptions);
    },
  });
});
