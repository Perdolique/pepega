import { createLogger } from '@pepega/utils/logger'
import { FetchError, ofetch } from 'ofetch'
import { validateBotToken } from './utils/validation'

// TODO: Improve types
interface SuccessResult {
  ok: true;

  result: {
    message_id: number;
    date: number;
    text: string;

    sender_chat: {
      id: number;
      title: string;
      username: string;
      type: 'channel';
    }

    chat: {
      id: number;
      title: string;
      username: string;
      type: 'channel';
    }
  }
}

interface ErrorResult {
  ok: false;
  code: number;
  message: string;
}

interface SendMessageParams {
  /** Telegram channel name without '@' */
  chatId: string;
  text: string;
  botToken: string;
  debug?: boolean;
}

const logger = createLogger('telegram')

export async function sendMessage({ chatId, text, debug, botToken } : SendMessageParams) : Promise<SuccessResult | ErrorResult> {
  const tokenValidationResult = validateBotToken(botToken)

  if (tokenValidationResult.success === false) {
    return {
      ok: false,
      code: 400,
      message: 'Invalid Telegram bot token'
    }
  }

  if (debug) {
    logger.info(`Sending message to Telegram channel @${chatId}`)
  }

  try {
    // https://core.telegram.org/bots/api#sendmessage
    const response = await ofetch<SuccessResult>(`https://api.telegram.org/bot${tokenValidationResult.output}/sendMessage`, {
      method: 'POST',

      body: {
        chat_id: `@${chatId}`,
        text
      },

      retry: 3,
      retryDelay: 1000
    })

    return response
  } catch (error) {
    let errorCode = 0
    let errorMessage = 'Unknown error'

    if (error instanceof FetchError) {
      if (error?.data?.error_code !== undefined) {
        errorCode = error.data.error_code
      }

      if (error?.data?.description !== undefined) {
        errorMessage = error.data.description
      }
    }

    return {
      ok: false,
      code: errorCode,
      message: errorMessage
    }
  }
}
