import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { sendMessage } from '@pepega/telegram'
import { kvStorageName } from '~~/constants'
import { getValidatedDebug, getValidatedTelegramBotToken, idStringAsNumberSchema } from '~~/server/utils/validation'
import { getTelegramChannelVerificationCodeKey } from '~~/server/utils/kv'

const routerParamsSchema = v.object({
  id: idStringAsNumberSchema
})

function routerParamsValidator(params: unknown) {
  return v.parse(routerParamsSchema, params)
}

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: channelId } = await getValidatedRouterParams(event, routerParamsValidator)
  const telegramBotToken = getValidatedTelegramBotToken()

  // 1. Check if channel exists and belongs to the user

  const channel = await db.query.telegramChannels.findFirst({
    columns: {
      id: true,
      chatId: true
    },

    where: and(
      eq(tables.telegramChannels.userId, userId),
      eq(tables.telegramChannels.id, channelId),
      eq(tables.telegramChannels.isVerified, false)
    )
  })

  if (channel === undefined) {
    throw createError({
      statusCode: 404,
      message: 'Channel not found'
    })
  }

  // 2. Check if code was sent recently

  const storage = useStorage<string>(kvStorageName)
  const kvLastSentKey = `telegram-channel-verification-code-last-sent:${userId}`
  const lastSent = await storage.getItem(kvLastSentKey)

  if(lastSent !== null) {
    logger.info('Code was sent recently, skipping', {
      userId,
      chatId: channel.chatId
    })

    throw createError({
      statusCode: 429,
      message: 'Easy, dude... You are sending codes too fast'
    })
  }

  // 3. Generate or get verification code from storage

  const kvCodeKey = getTelegramChannelVerificationCodeKey(userId, channelId)
  let code = await storage.getItem(kvCodeKey)

  if (code === null) {
    logger.info('Code not found in storage, generating new one')

    code = getRandomCode()

    // Why "${code}"?
    // FIXME: https://github.com/unjs/unstorage/issues/277
    await storage.setItem(kvCodeKey, `"${code}"`, {
      expirationTtl: 60 * 5 // 5 minutes
    })
  }

  // 4. Send code to telegram channel

  const maskedCode = code.replace(/^(\d)\d+?(\d)$/, '$1****$2')
  const debug = getValidatedDebug()

  logger.info(`Sending verification code to channel ${channelId}: ${maskedCode}`)

  const result = await sendMessage({
    debug,
    botToken: telegramBotToken,
    chatId: channel.chatId,
    text: `Pepega verification code is: ${code}`
  })

  if (result.ok) {
    // 5. Update last code sent time

    await storage.setItem(kvLastSentKey, 'true', {
      expirationTtl: 60 // 1 minute
    })
  }

  if (result.ok === false) {
    logger.error('Error sending verification code:', result)

    throw createError({
      statusCode: result.code,
      message: result.message
    })
  }

  sendNoContent(event)
})
