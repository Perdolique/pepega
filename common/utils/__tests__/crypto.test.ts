import { describe, expect, it } from 'vitest';
import { decrypt, encrypt } from '../crypto';

describe('aES-GCM crypto', () => {
  it('round trips plain text', async () => {
    const encrypted = await encrypt('double apple', 'secret');
    const decrypted = await decrypt(encrypted, 'secret');

    expect(decrypted).toBe('double apple');
  });

  it('round trips Unicode text', async () => {
    const encrypted = await encrypt('двойное яблочко 🍎🍏', 'secret');
    const decrypted = await decrypt(encrypted, 'secret');

    expect(decrypted).toBe('двойное яблочко 🍎🍏');
  });

  it('rejects an incorrect password', async () => {
    const encrypted = await encrypt('protected', 'correct-password');
    const decryption = decrypt(encrypted, 'incorrect-password');

    await expect(decryption).rejects.toThrow();
  });

  it('rejects a corrupted payload', async () => {
    const encrypted = await encrypt('protected', 'secret');
    const payload = Uint8Array.from(atob(encrypted), (character) => character.codePointAt(0) ?? 0);
    const lastIndex = payload.length - 1;
    const lastByte = payload[lastIndex];

    expect(lastByte).toBeDefined();

    payload[lastIndex] = (lastByte ?? 0) ^ 1;

    const corrupted = btoa(String.fromCodePoint(...payload));
    const decryption = decrypt(corrupted, 'secret');

    await expect(decryption).rejects.toThrow();
  });
});
