import { validateAdmin } from '~~/server/utils/admin';
import { tables } from '~~/server/utils/database';
import {
  getValidatedEncryptionKey,
  getValidatedTwitchClientId,
  stringToIntegerSchema,
} from '~~/server/utils/validation';
import { createError, defineEventHandler, getValidatedRouterParams, sendNoContent } from 'h3';
import logger from '~~/server/utils/logger';
import { deleteSubscription } from '@pepega/twitch/subscriptions';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { obtainTwitchAppToken } from '~~/server/utils/twitch/auth';

const paramsSchema = v.object({
  id: stringToIntegerSchema,
});

function idValidator(params: unknown) {
  return v.parse(paramsSchema, params);
}

export default defineEventHandler(async (event) => {
  const { db } = event.context;
  const { id: webhookId } = await getValidatedRouterParams(event, idValidator);

  await validateAdmin(event);

  const deleted = await db
    .delete(tables.webhooks)
    .where(eq(tables.webhooks.id, webhookId))
    .returning({
      id: tables.webhooks.id,
      subscriptionId: tables.webhooks.subscriptionId,
    });

  if (deleted.length === 0) {
    throw createError({
      statusCode: 404,
    });
  }

  try {
    const encryptionKey = getValidatedEncryptionKey();
    const appAccessToken = await obtainTwitchAppToken(encryptionKey);
    const clientId = getValidatedTwitchClientId();

    for (const { subscriptionId } of deleted) {
      if (subscriptionId !== null) {
        logger.info('Deleting subscription on Twitch:', subscriptionId);

        try {
          await deleteSubscription({
            clientId,
            token: appAccessToken,
            id: subscriptionId,
          });
        } catch (error) {
          logger.warn('Error deleting subscription on Twitch:', error);
        }
      }
    }
  } catch (error) {
    logger.warn('Error deleting subscription on Twitch:', error);
  }

  sendNoContent(event);
});
