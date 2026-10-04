import { createHmac } from 'node:crypto';
import { once } from 'node:events';
import { beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import type { StreamOnlineNotification } from '@pepega/twitch/models/event-sub';
import { encrypt } from '@pepega/utils/crypto';
import worker from '../app';
import { sendTelegramNotification } from '../utils/telegram';

const database = vi.hoisted(() => {
  const selectWhere = vi.fn<() => Promise<unknown[]>>();
  const finalJoin = { where: selectWhere };
  const secondJoin = { leftJoin: vi.fn(() => finalJoin) };
  const firstJoin = {
    where: selectWhere,
    leftJoin: vi.fn(() => secondJoin),
  };
  const select = vi.fn(() => ({
    from: vi.fn(() => ({ innerJoin: vi.fn(() => firstJoin) })),
  }));
  const updateWhere = vi.fn(async () => []);
  const updateSet = vi.fn(() => ({ where: updateWhere }));
  const update = vi.fn(() => ({ set: updateSet }));

  return { select, selectWhere, update, updateSet };
});

vi.mock(import('@pepega/database/connection'), async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    createDrizzle: vi.fn().mockReturnValue(database),
  };
});

vi.mock(import('../utils/telegram'), () => ({
  sendTelegramNotification: vi.fn<typeof sendTelegramNotification>().mockResolvedValue(undefined),
}));

const encryptionKey = 'webhook-test-encryption-key';
const webhookSecret = 'webhook-test-secret';
const messageId = 'message-123';
const messageTimestamp = '2026-10-04T12:00:00Z';

const env = {
  TWITCH_APP_SECRET: 'test-app-secret',
  TWITCH_CLIENT_ID: 'test-client-id',
  DATABASE_URL: 'postgres://test:test@localhost/test',
  LOCAL_DATABASE: '',
  ENCRYPTION_KEY: encryptionKey,
  PEPEGA_DEBUG: '',
  TELEGRAM_BOT_TOKEN: 'test-bot-token',
  get KV(): KVNamespace {
    throw new Error('Unexpected KV access in webhook test');
  },
} satisfies Env;

function makeContext() {
  return {
    waitUntil: vi.fn<(promise: Promise<unknown>) => void>(),
    passThroughOnException: vi.fn(),
    abort: vi.fn(),
    props: undefined,
    get exports(): ExecutionContext['exports'] {
      throw new Error('Unexpected worker exports access in webhook test');
    },
    get tracing(): ExecutionContext['tracing'] {
      throw new Error('Unexpected tracing access in webhook test');
    },
  } satisfies ExecutionContext;
}

function makeRequest(messageType: string, body: string, path = '/online') {
  const signatureInput = `${messageId}${messageTimestamp}${body}`;
  const signature = createHmac('sha256', webhookSecret)
    .update(signatureInput)
    .digest('hex');
  const url = `https://webhooks.example.test${path}`;

  return new Request<unknown, IncomingRequestCfProperties>(url, {
    method: 'POST',
    headers: {
      'twitch-eventsub-message-type': messageType,
      'twitch-eventsub-message-id': messageId,
      'twitch-eventsub-message-timestamp': messageTimestamp,
      'twitch-eventsub-message-signature': `sha256=${signature}`,
    },
    body,
  });
}

async function fetchWorker(request: Request<unknown, IncomingRequestCfProperties>, context = makeContext()) {
  const response = await worker.fetch(request, env, context);

  return { response, context };
}

const notification = {
  subscription: {
    id: 'subscription-123',
    status: 'enabled',
    type: 'stream.online',
    version: '1',
    cost: 0,
    condition: { broadcaster_user_id: 'broadcaster-123' },
    transport: {
      method: 'webhook',
      callback: 'https://webhooks.example.test/online',
    },
    created_at: '2026-10-04T11:00:00Z',
  },
  event: {
    id: 'stream-123',
    broadcaster_user_id: 'broadcaster-123',
    broadcaster_user_login: 'streamer',
    broadcaster_user_name: 'Streamer',
    type: 'live',
    started_at: '2026-10-04T12:00:00Z',
  },
} satisfies StreamOnlineNotification;

describe('twitch webhook worker HTTP contract', () => {
  beforeEach(() => {
    database.selectWhere.mockReset();
  });

  it('returns the exact challenge as plain text on an online subpath and activates the webhook', async () => {
    // Arrange
    const challenge = 'challenge-🍎\nsecond line';
    const body = JSON.stringify({
      challenge,
      subscription: {
        id: notification.subscription.id,
        condition: notification.subscription.condition,
      },
    }, null, 2);
    const secretHash = await encrypt(webhookSecret, encryptionKey);
    database.selectWhere.mockResolvedValueOnce([{ id: 'webhook-123', secretHash }]);
    const request = makeRequest('webhook_callback_verification', body, '/online/twitch');

    // Act
    const { response, context } = await fetchWorker(request);
    const responseBuffer = await response.arrayBuffer();
    const responseBytes = new Uint8Array(responseBuffer);
    const encoder = new TextEncoder();
    const expectedBytes = encoder.encode(challenge);

    // Assert
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain');
    expect(responseBytes).toStrictEqual(expectedBytes);
    expect(database.updateSet).toHaveBeenCalledWith({ status: 'active' });
    expect(context.waitUntil).not.toHaveBeenCalled();
  });

  it('rejects a challenge with a bad signature without updating the webhook', async () => {
    // Arrange
    const body = JSON.stringify({
      challenge: 'challenge',
      subscription: {
        id: notification.subscription.id,
        condition: notification.subscription.condition,
      },
    }, null, 2);
    const secretHash = await encrypt(webhookSecret, encryptionKey);
    database.selectWhere.mockResolvedValueOnce([{ id: 'webhook-123', secretHash }]);
    const request = makeRequest('webhook_callback_verification', body);
    request.headers.set('twitch-eventsub-message-signature', 'sha256=invalid');

    // Act
    const { response, context } = await fetchWorker(request);

    // Assert
    expect(response.status).toBe(403);
    expect(database.update).not.toHaveBeenCalled();
    expect(context.waitUntil).not.toHaveBeenCalled();
  });

  it('acknowledges a notification with empty 204 and sends Telegram in waitUntil', async () => {
    // Arrange
    const body = JSON.stringify(notification);
    const secretHash = await encrypt(webhookSecret, encryptionKey);
    const controller = new AbortController();
    onTestFinished(() => controller.abort());
    const webhookQuery = once(controller.signal, 'abort').then(() => [{
      streamerId: 'streamer-123',
      secretHash,
    }]);
    database.selectWhere
      .mockReturnValueOnce(webhookQuery)
      .mockResolvedValueOnce([{
        config: { type: 'telegram' },
        message: 'Streamer is online',
        telegramChatId: 'streamer_channel',
      }]);
    const request = makeRequest('notification', body);

    // Act
    const { response, context } = await fetchWorker(request);
    const responseBody = await response.text();

    // Assert the acknowledgment arrives while the database query is still pending.
    expect(response.status).toBe(204);
    expect(responseBody).toBe('');
    expect(sendTelegramNotification).not.toHaveBeenCalled();
    expect(context.waitUntil).toHaveBeenCalledTimes(1);
    const task = context.waitUntil.mock.calls[0]?.[0];
    expect(task).toBeInstanceOf(Promise);
    controller.abort();
    await task;

    // Assert
    expect(sendTelegramNotification).toHaveBeenCalledExactlyOnceWith({
      debug: false,
      chatId: 'streamer_channel',
      message: 'Streamer is online',
      botToken: env.TELEGRAM_BOT_TOKEN,
    });
  });

  it.each([
    ['malformed JSON', '{invalid json'],
    ['a UTF-8 BOM before JSON', `\uFEFF${JSON.stringify(notification)}`],
  ])('returns 400 for %s without scheduling work', async (_case, body) => {
    // Arrange
    const request = makeRequest('notification', body);

    // Act
    const { response, context } = await fetchWorker(request);

    // Assert
    expect(response.status).toBe(400);
    expect(context.waitUntil).not.toHaveBeenCalled();
    expect(database.select).not.toHaveBeenCalled();
  });

  it('returns 404 outside the online route', async () => {
    // Arrange
    const request = new Request<unknown, IncomingRequestCfProperties>('https://webhooks.example.test/elsewhere');

    // Act
    const { response, context } = await fetchWorker(request);

    // Assert
    expect(response.status).toBe(404);
    expect(context.waitUntil).not.toHaveBeenCalled();
    expect(database.select).not.toHaveBeenCalled();
  });
});
