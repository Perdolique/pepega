import type { ToastTone } from '~/types/ui'
import { useState } from '#imports'

export interface Toast {
  readonly id: string;
  readonly message: string;
  readonly title?: string;
  readonly tone?: ToastTone;
  readonly duration?: number | null;
}

type ToastParams = Omit<Toast, 'id'>;

const defaultDuration = 5000;

export default function useToaster() {
  const toasts = useState<Toast[]>('toaster', () => []);

  function addToast({
    message,
    duration = defaultDuration,
    title,
    tone
  } : ToastParams) {
    // Skip SSR rendering
    if (import.meta.server) {
      return;
    }

    const id = crypto.randomUUID();

    toasts.value.unshift({
      id,
      message,
      title,
      duration,
      tone
    });
  }

  function removeToast(id: string) {
    const foundIndex = toasts.value.findIndex(toast => toast.id === id);

    if (foundIndex >= 0) {
      toasts.value.splice(foundIndex, 1);
    }
  }

  return {
    toasts,
    addToast,
    removeToast
  }
}
