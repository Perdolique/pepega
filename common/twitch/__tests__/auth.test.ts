import { describe, expect, it } from 'vitest';
import { decodeStateData, encodeStateData, getAuthUrl, verifyEventMessage } from '../auth';

async function createSignature(message: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const hex = [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return `sha256=${hex}`;
}

describe(verifyEventMessage, () => {
  it('accepts a valid Twitch HMAC signature', async () => {
    const messageId = 'message-id';
    const messageTimestamp = '2026-08-09T12:00:00Z';
    const bodyString = '{"event":"online"}';
    const secret = 'eventsub-secret';
    const message = `${messageId}${messageTimestamp}${bodyString}`;
    const messageSignature = await createSignature(message, secret);

    const result = await verifyEventMessage({
      bodyString,
      messageId,
      messageSignature,
      messageTimestamp,
      secret,
    });

    expect(result).toBe(true);
  });

  it('rejects an invalid Twitch HMAC signature', async () => {
    const result = await verifyEventMessage({
      bodyString: '{}',
      messageId: 'message-id',
      messageSignature: 'sha256=invalid',
      messageTimestamp: '2026-08-09T12:00:00Z',
      secret: 'eventsub-secret',
    });

    expect(result).toBe(false);
  });
});

describe('oAuth state', () => {
  it('encodes and decodes redirect state', () => {
    const encoded = encodeStateData({ redirectTo: '/dashboard?from=twitch' });
    const decoded = decodeStateData(encoded);

    expect(decoded).toStrictEqual({ redirectTo: '/dashboard?from=twitch' });
  });

  it('rejects malformed state', () => {
    expect(decodeStateData('not-base64')).toBeNull();
    expect(decodeStateData(123)).toBeNull();
  });
});

describe(getAuthUrl, () => {
  it('builds the Twitch authorization URL', () => {
    const url = new URL(
      getAuthUrl({
        clientId: 'client-id',
        redirectUri: 'https://example.com/auth/twitch',
        stateData: { redirectTo: '/dashboard' },
      }),
    );

    expect(url.origin).toBe('https://id.twitch.tv');
    expect(url.pathname).toBe('/oauth2/authorize');
    expect(url.searchParams.get('client_id')).toBe('client-id');
    expect(url.searchParams.get('redirect_uri')).toBe('https://example.com/auth/twitch');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(decodeStateData(url.searchParams.get('state'))).toStrictEqual({
      redirectTo: '/dashboard',
    });
  });
});
