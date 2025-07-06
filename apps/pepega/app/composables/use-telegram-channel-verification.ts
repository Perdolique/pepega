interface SendCodeParams {
  code: string
  channelId: string
}

export default function useTelegramChannelVerification() {
  function sendCode({ channelId } : SendCodeParams) {
    return $fetch(`/api/telegram/channel/${channelId}/send-code`, {
      method: 'POST'
    })
  }

  return { sendCode }
}
