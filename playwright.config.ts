import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Read from ".env" file.
dotenv.config({ path: path.resolve(import.meta.dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: '100%',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    video: 'off',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: '**/logout.spec.ts',
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: '**/logout.spec.ts',
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 7'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: '**/logout.spec.ts',
    },
    {
      name: 'cleanup',
      testMatch: '**/logout.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['chromium', 'Mobile Safari', 'Mobile Chrome'],
    },
  ],

  webServer: {
    command: 'npx http-server dist/gin-tonic-web-player/browser -p 4200 -P http://localhost:4200?',
    port: 4200,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
