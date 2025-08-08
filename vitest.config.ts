import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./client/src/__tests__/setupTests.ts'],
    alias: {
      '@/': new URL('./client/src/', import.meta.url).pathname,
      '@shared': new URL('./shared', import.meta.url).pathname,
    },
    include: ['client/src/__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
});
