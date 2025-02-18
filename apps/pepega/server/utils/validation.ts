import * as v from 'valibot'

export const webhookIdSchema = v.pipe(
  v.string(),
  v.transform(Number),
  v.number(),
  v.integer(),
  v.minValue(1)
)

const envSchema = v.object({
  // WEBHOOK_BASE_URL
  webhookBaseUrl: v.pipe(
    v.string(),
    v.transform((input) => new URL(input).origin)
  ),

  // OAUTH_TWITCH_CLIENT_ID
  twitchClientId: v.string(),
  // ENCRYPTION_KEY
  encryptionKey: v.string()
})

/**
 * Get validated environment variables
 */
export function getValidatedEnv() {
  const { success, output, issues } = v.safeParse(envSchema, {
    webhookBaseUrl: process.env.WEBHOOK_BASE_URL,
    twitchClientId: process.env.OAUTH_TWITCH_CLIENT_ID,
    encryptionKey: process.env.ENCRYPTION_KEY
  })

  if (success === false) {
    console.error('Invalid environment variables:', issues)

    throw new Error('Invalid environment variables')
  }

  return output
}
