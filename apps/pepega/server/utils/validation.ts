import * as v from 'valibot'

export const webhookIdSchema = v.pipe(
  v.string(),
  v.transform(Number),
  v.number(),
  v.integer(),
  v.minValue(1)
)

// OAUTH_TWITCH_CLIENT_ID
const twitchClientIdSchema = v.string()

// OAUTH_TWITCH_CLIENT_SECRET
const twitchClientSecretSchema = v.string()

// ENCRYPTION_KEY
const encryptionKeySchema = v.string()

// WEBHOOK_BASE_URL
const webhookBaseUrlSchema = v.pipe(
  v.string(),
  v.transform((input) => new URL(input).origin)
)

export function getValidatedTwitchClientId() {
  const { success, output } = v.safeParse(twitchClientIdSchema, process.env.OAUTH_TWITCH_CLIENT_ID)

  if (success === false) {
    throw new Error('Invalid Twitch Client ID')
  }

  return output
}

export function getValidatedTwitchClientSecret() {
  const { success, output } = v.safeParse(twitchClientSecretSchema, process.env.OAUTH_TWITCH_CLIENT_SECRET)

  if (success === false) {
    throw new Error('Invalid Twitch Client Secret')
  }

  return output
}

export function getValidatedEncryptionKey() {
  const { success, output } = v.safeParse(encryptionKeySchema, process.env.ENCRYPTION_KEY)

  if (success === false) {
    throw new Error('Invalid Encryption Key')
  }

  return output
}

export function getValidatedWebhookBaseUrl() {
  const { success, output } = v.safeParse(webhookBaseUrlSchema, process.env.WEBHOOK_BASE_URL)

  if (success === false) {
    throw new Error('Invalid Webhook Base URL')
  }

  return output
}
