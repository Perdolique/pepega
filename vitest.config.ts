// oxlint-disable import/no-default-export
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('apps/pepega/app', import.meta.url)),
      '@@': import.meta.dirname,
      '~': fileURLToPath(new URL('apps/pepega/app', import.meta.url)),
      '~~': import.meta.dirname,
      '#shared': fileURLToPath(new URL('apps/pepega/shared', import.meta.url)),
    },
  },

  test: {
    include: ['**/__tests__/*.test.ts'],
  },
});
