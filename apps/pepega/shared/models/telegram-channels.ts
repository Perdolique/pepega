export type TelegramChannelStatus = 'not_verified' | 'pending' | 'verified' | 'failed' | 'unknown';

export interface TelegramChannelModel {
  id: number;
  chatId: string;
  userId: string;
  status: TelegramChannelStatus;
}
