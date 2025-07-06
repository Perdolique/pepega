import { EventMessageType } from '@pepega/twitch/models/event-sub'
import { UnionToTuple } from '@pepega/utils/types'
import * as v from 'valibot'
import logger from '../logger'
import { EventHandlerRequest, H3Event } from 'h3'

// TODO: move under validation directory

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

// TODO: move to common package
// PEPEGA_DEBUG="1"
const envDebugSchema = v.literal('1')

const eventMessageTypeSchema = v.picklist<UnionToTuple<EventMessageType>>([
  'notification',
  'webhook_callback_verification',
  'revocation'
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

export function getValidatedRequiredEnv(event: H3Event<EventHandlerRequest>) : v.InferOutput<typeof envSchema> {
  const testData = {
    twitchClientId: event.context.cloudflare.env.TWITCH_CLIENT_ID,
    twitchAppSecret: event.context.cloudflare.env.TWITCH_APP_SECRET,
    databaseUrl: event.context.cloudflare.env.DATABASE_URL,
    localDatabase: event.context.cloudflare.env.LOCAL_DATABASE,
    encryptionKey: event.context.cloudflare.env.ENCRYPTION_KEY
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

export function validateEventMessageType(value: unknown) {
  return v.parse(eventMessageTypeSchema, value)
}

// TODO: Move to Twitch module
export function validateEventVerificationHeaders(headers: unknown) {
  return v.parse(twitchEventSubVerificationHeadersSchema, headers)
}

export function getValidatedDebug(event: H3Event<EventHandlerRequest>) : boolean {
  const { success } = v.safeParse(envDebugSchema, event.context.cloudflare.env.PEPEGA_DEBUG)

  return success
}
