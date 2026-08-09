import { $fetch } from 'ofetch';
import { defineQueryOptions } from '@pinia/colada';
import { telegramQueryKeys } from '~/composables/keys/telegram';
import type { TelegramChannelModel } from '~~/shared/models/telegram-channels';

export const getTelegramChannels = defineQueryOptions({
  key: telegramQueryKeys.channels(),
  enabled: import.meta.client,

  async query() {
    return $fetch<TelegramChannelModel[]>('/api/telegram/channel', {
      method: 'GET',
    });
  },
});
