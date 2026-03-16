/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['tests/**', 'node_modules/**'],
  },
  resolve: {
    mainFields: ['module'], // Prefer ESM
  },
});
