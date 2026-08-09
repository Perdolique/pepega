import { describe, expect, it } from 'vitest';
import { validateEventMessageType, validateEventVerificationHeaders } from '../validation';

describe(validateEventMessageType, () => {
  it.each(['notification', 'webhook_callback_verification', 'revocation'])(
    'accepts %s',
    (messageType) => {
      expect(validateEventMessageType(messageType)).toBe(messageType);
    },
  );

  it.each([undefined, 'unknown', 42])('rejects invalid value %s', (messageType) => {
    expect(() => validateEventMessageType(messageType)).toThrow();
  });
});

describe(validateEventVerificationHeaders, () => {
  it('maps valid Twitch verification headers', () => {
    const result = validateEventVerificationHeaders({
      'twitch-eventsub-message-id': 'message-id',
      'twitch-eventsub-message-signature': 'sha256=signature',
      'twitch-eventsub-message-timestamp': '2026-08-09T12:00:00Z',
    });

    expect(result).toStrictEqual({
      messageId: 'message-id',
      messageSignature: 'sha256=signature',
      messageTimestamp: '2026-08-09T12:00:00Z',
    });
  });

  it.each([
    {},
    { 'twitch-eventsub-message-id': 'message-id' },
    {
      'twitch-eventsub-message-id': 42,
      'twitch-eventsub-message-signature': 'sha256=signature',
      'twitch-eventsub-message-timestamp': '2026-08-09T12:00:00Z',
    },
  ])('rejects invalid headers', (headers) => {
    expect(() => validateEventVerificationHeaders(headers)).toThrow();
  });
});
