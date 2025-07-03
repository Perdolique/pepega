export function getTelegramChannelVerificationCodeKey(userId: string, channelId: number) : string {
  return `telegram-channel-verification-code:${userId}:${channelId}`
}
