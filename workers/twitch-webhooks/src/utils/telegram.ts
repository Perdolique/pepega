import { sendMessage } from '@pepega/telegram'
import logger from '../logger'

interface SendTelegramNotificationParams {
  chatId: string;
  message: string;
  botToken: string;
  debug?: boolean;
}

export async function sendTelegramNotification({ chatId, message, botToken, debug }: SendTelegramNotificationParams) {
  const result = await sendMessage({
    chatId,
    debug,
    botToken,
    text: message,
  })

  if (result.ok) {
    logger.info(`Telegram notification sent to @${chatId}`)
  } else {
    logger.error(`Failed to send Telegram notification to @${chatId}`, result)
  }
}
