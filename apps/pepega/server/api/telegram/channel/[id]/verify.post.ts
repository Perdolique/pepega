import { and, eq } from 'drizzle-orm'
import * as v from 'valibot'
import { kvStorageName } from '~~/constants'
import { getTelegramChannelVerificationCodeKey } from '~~/server/utils/kv'
import { idStringAsNumberSchema } from '~~/server/utils/validation'

const routerParamsSchema = v.object({
  id: idStringAsNumberSchema
})

const bodySchema = v.object({
  code: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.regex(/^\d+$/)
  )
})

function routerParamsValidator(params: unknown) {
  return v.parse(routerParamsSchema, params)
}

function bodyValidator(body: unknown) {
  return v.parse(bodySchema, body)
}

export default defineEventHandler(async (event) => {
  const { userId, db } = event.context
  const { id: channelId } = await getValidatedRouterParams(event, routerParamsValidator)
  const { code } = await readValidatedBody(event, bodyValidator)

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

  // 2. Check if verification request was sent recently

  const storage = useStorage<string>(kvStorageName)
  const kvCheckKey = `telegram-channel-verification-check:${userId}`
  const lastCheck = await storage.getItem(kvCheckKey)

  if (lastCheck !== null) {
    logger.info('Verification request was sent recently, skipping', {
      userId,
      chatId: channel.chatId
    })

    throw createError({
      statusCode: 429,
      message: 'Easy, dude... You are too fast'
    })
  } else {
    await storage.setItem(kvCheckKey, 'true', {
      expirationTtl: 60 // 1 minute
    })
  }

  // 3. Get verification code from storage

  const kvCodeKey = getTelegramChannelVerificationCodeKey(userId, channelId)
  const storedCode = await storage.getItem(kvCodeKey)

  if (storedCode === null) {
    throw createError({
      statusCode: 400,
      message: 'Verification code not found or expired'
    })
  }

  // 4. Verify the code

  if (code !== storedCode) {
    throw createError({
      statusCode: 400,
      message: 'Invalid verification code'
    })
  }

  // 5. Mark channel as verified
  // TODO: Delete message with verification code from Telegram

  await db
    .update(tables.telegramChannels)
    .set({
      isVerified: true
    })
    .where(
      and(
        eq(tables.telegramChannels.userId, userId),
        eq(tables.telegramChannels.id, channelId)
      )
    )

  // 6. Clean up the verification code from storage

  await storage.removeItem(kvCodeKey)

  logger.info('Channel verified successfully', {
    userId,
    channelId,
    chatId: channel.chatId
  })

  return sendNoContent(event)
})
