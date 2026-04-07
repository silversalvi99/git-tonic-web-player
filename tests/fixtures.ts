import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  // Automatically mock Keycloak on the page fixture
  page: async ({ page }, use) => {
    // Enable browser console logging in terminal
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`BROWSER ERROR: ${msg.text()}`);
      } else {
        console.log(`BROWSER LOG: ${msg.text()}`);
      }
    });

    await page.addInitScript(() => {
      window.Audio.prototype.play = () => Promise.resolve();
      window.Audio.prototype.pause = () => {};
      localStorage.setItem('gin_tonic_settings', JSON.stringify({ language: 'en' }));
    });

    await use(page);
  },
});

export { expect };

// Mock Subsonic helper
export async function mockRandomSongs(page: import('@playwright/test').Page, songs: any[] = []) {
  await page.route(
    (url) => url.href.includes('getRandomSongs.view'),
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          'subsonic-response': {
            status: 'ok',
            version: '1.16.1',
            randomSongs: {
              song:
                songs.length > 0 ? songs : [{ id: '1', title: 'Default Mock', artist: 'Tester' }],
            },
          },
        }),
      });
    },
  );
}
