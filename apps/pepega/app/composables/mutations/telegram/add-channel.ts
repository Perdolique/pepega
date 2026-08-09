import { defineMutation, useMutation, useQueryCache } from '@pinia/colada';
import { $fetch } from 'ofetch';
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels';
import { telegramQueryKeys } from '~/composables/keys/telegram';

export const useAddTelegramChannel = defineMutation(() => {
  const queryCache = useQueryCache();

  return useMutation({
    async mutation(chatId: string) {
      return $fetch<TelegramChannelModel>('/api/telegram/channel', {
        method: 'POST',
        body: { chatId },
      });
    },

    async onSettled() {
      const channelsKey = telegramQueryKeys.channels();

      return queryCache.invalidateQueries({ key: channelsKey });
    },
  });
});
