import { afterEach, describe, expect, it, vi } from 'vitest';
import { withMinimumDelay } from '../async';

describe(withMinimumDelay, () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits for the minimum delay before resolving', async () => {
    vi.useFakeTimers();
    const delayed = withMinimumDelay(Promise.resolve('done'), 500);
    let isSettled = false;

    void delayed.finally(() => {
      isSettled = true;
    });

    await vi.advanceTimersByTimeAsync(499);
    expect(isSettled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await expect(delayed).resolves.toBe('done');
  });

  it('waits for the minimum delay before rejecting', async () => {
    vi.useFakeTimers();
    const error = new Error('failed');
    const delayed = withMinimumDelay(Promise.reject(error), 500);
    let isSettled = false;

    void delayed.catch(() => {
      isSettled = true;
    });

    await vi.advanceTimersByTimeAsync(499);
    expect(isSettled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await expect(delayed).rejects.toBe(error);
  });
});
