import * as v from 'valibot'
import { TwitchEventSubMessageType } from '../models/twitch'
import logger from '../logger'

const envSchema = v.object({
  // TWITCH_APP_SECRET
  twitchAppSecret: v.string(),
  // TWITCH_CLIENT_ID
  twitchClientId: v.string(),
  // DATABASE_URL
  databaseUrl: v.string(),
  // ENCRYPTION_KEY
  encryptionKey: v.string(),
  // LOCAL_DATABASE
  localDatabase: v.pipe(
    v.optional(
      v.string()
    ),

    v.transform((value) => typeof value === 'string')
  )
})

const twitchEventSubMessageTypeSchema = v.union([
  v.literal<TwitchEventSubMessageType>('notification'),
  v.literal<TwitchEventSubMessageType>('webhook_callback_verification'),
  v.literal<TwitchEventSubMessageType>('revocation')
])

const twitchEventSubVerificationHeadersSchema = v.pipe(
  v.object({
    'twitch-eventsub-message-id': v.string(),
    'twitch-eventsub-message-timestamp': v.string(),
    'twitch-eventsub-message-signature': v.string()
  }),

  v.transform((headers) => ({
    messageId: headers['twitch-eventsub-message-id'],
    messageTimestamp: headers['twitch-eventsub-message-timestamp'],
    messageSignature: headers['twitch-eventsub-message-signature']
  }))
)

export function getValidatedEnv(env: Env) : v.InferOutput<typeof envSchema> {
  const testData = {
    twitchClientId: env.TWITCH_CLIENT_ID,
    twitchAppSecret: env.TWITCH_APP_SECRET,
    databaseUrl: env.DATABASE_URL,
    localDatabase: env.LOCAL_DATABASE,
    encryptionKey: env.ENCRYPTION_KEY
  } satisfies v.InferInput<typeof envSchema>

  const { success, output, issues } = v.safeParse(envSchema, testData)

  if (success === false) {
    const safeIssues = []

    for (const issue of issues) {
      if (issue.path !== undefined) {
        for (const path of issue.path) {
          safeIssues.push({
            message: issue.message,
            key: path.key,
            expected: issue.expected,
            received: issue.received
          })
        }
      }
    }

    logger.error('Invalid environment variables:', safeIssues)

    throw new Error('Invalid environment variables')
  }

  return output
}

export function validateTwitchEventSubMessageType(value: unknown) {
  return v.parse(twitchEventSubMessageTypeSchema, value)
}

// TODO: Move to Twitch module
export function validateTwitchEventSubVerificationHeaders(headers: unknown) {
  return v.parse(twitchEventSubVerificationHeadersSchema, headers)
}
