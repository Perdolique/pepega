import { $fetch } from 'ofetch';

interface SendCodeParams {
  code: string;
  channelId: string;
}

function useTelegramChannelVerification() {
  async function sendCode({ channelId }: SendCodeParams) {
    await $fetch<void>(`/api/telegram/channel/${channelId}/send-code`, {
      method: 'POST',
    });
  }

  return { sendCode };
}

export { useTelegramChannelVerification };
