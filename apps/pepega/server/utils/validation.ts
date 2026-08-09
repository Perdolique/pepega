import * as v from 'valibot';
import type { NotificationEventType } from '~~/shared/models/notifications';

const stringToIntegerSchema = v.pipe(
  v.string(),
  v.transform(Number),
  v.number(),
  v.integer(),
  v.minValue(1),
);

const idNumberSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const idStringAsNumberSchema = v.pipe(
  v.string(),
  v.nonEmpty(),
  v.transform((value) => Number(value)),
  idNumberSchema,
);

const notificationEventTypeSchema = v.literal<NotificationEventType>('stream.online');

// Any string that is not empty
const envVariableStringSchema = v.pipe(v.string(), v.nonEmpty());

// TODO: move to common package
// PEPEGA_DEBUG="1"
const debugSchema = v.literal('1');

// WEBHOOK_BASE_URL
const webhookBaseUrlSchema = v.pipe(
  v.string(),
  v.transform((input) => new URL(input).origin),
);

function getValidatedTwitchClientId() {
  const { success, output } = v.safeParse(
    envVariableStringSchema,
    process.env.OAUTH_TWITCH_CLIENT_ID,
  );

  if (success === false) {
    throw new Error('Invalid Twitch Client ID');
  }

  return output;
}

function getValidatedTwitchClientSecret() {
  const { success, output } = v.safeParse(
    envVariableStringSchema,
    process.env.OAUTH_TWITCH_CLIENT_SECRET,
  );

  if (success === false) {
    throw new Error('Invalid Twitch Client Secret');
  }

  return output;
}

function getValidatedEncryptionKey() {
  const { success, output } = v.safeParse(envVariableStringSchema, process.env.ENCRYPTION_KEY);

  if (success === false) {
    throw new Error('Invalid Encryption Key');
  }

  return output;
}

function getValidatedWebhookBaseUrl() {
  const { success, output } = v.safeParse(webhookBaseUrlSchema, process.env.WEBHOOK_BASE_URL);

  if (success === false) {
    throw new Error('Invalid Webhook Base URL');
  }

  return output;
}

function getValidatedDebug(): boolean {
  const { success } = v.safeParse(debugSchema, process.env.PEPEGA_DEBUG);

  return success;
}

function getValidatedTelegramBotToken() {
  const { success, output } = v.safeParse(envVariableStringSchema, process.env.TELEGRAM_BOT_TOKEN);

  if (success === false) {
    throw new Error('Invalid Telegram bot token');
  }

  return output;
}

export {
  stringToIntegerSchema,
  idNumberSchema,
  idStringAsNumberSchema,
  notificationEventTypeSchema,
  getValidatedTwitchClientId,
  getValidatedTwitchClientSecret,
  getValidatedEncryptionKey,
  getValidatedWebhookBaseUrl,
  getValidatedDebug,
  getValidatedTelegramBotToken,
};
