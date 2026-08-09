import { validateAdmin } from '~~/server/utils/admin';
import { tables } from '~~/server/utils/database';
import { getValidatedEncryptionKey, getValidatedTwitchClientId } from '~~/server/utils/validation';
import { createError, defineEventHandler, getValidatedRouterParams, sendNoContent } from 'h3';
import logger from '~~/server/utils/logger';
import { deleteSubscription } from '@pepega/twitch/subscriptions';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';
import { obtainTwitchAppToken } from '~~/server/utils/twitch/auth';

const paramsSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
});

function idValidator(params: unknown) {
  return v.parse(paramsSchema, params);
}

export default defineEventHandler(async (event) => {
  const { db } = event.context;
  const { id: subscriptionId } = await getValidatedRouterParams(event, idValidator);

  await validateAdmin(event);

  const encryptionKey = getValidatedEncryptionKey();
  const appAccessToken = await obtainTwitchAppToken(encryptionKey);
  const clientId = getValidatedTwitchClientId();

  try {
    logger.info('Deleting subscription on Twitch:', subscriptionId);

    await deleteSubscription({
      clientId,
      token: appAccessToken,
      id: subscriptionId,
    });

    try {
      logger.info('Deleting subscription from database:', subscriptionId);

      await db.delete(tables.webhooks).where(eq(tables.webhooks.subscriptionId, subscriptionId));
    } catch (error) {
      logger.error('Error deleting subscription from database:', error);
    }

    sendNoContent(event);
    return;
  } catch (error) {
    logger.error('Error deleting subscription on Twitch:', error);

    throw createError({
      statusCode: 400,
    });
  }
});
