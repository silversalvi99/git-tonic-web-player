import { test, expect } from '@playwright/test';

async function mockAudio(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    window.Audio.prototype.play = () => Promise.resolve();
    window.Audio.prototype.pause = () => {};
  });
}

async function mockRandomSongs(page: import('@playwright/test').Page, songs: object[] = []) {
  await page.route(
    (url) => url.href.includes('getRandomSongs.view'),
    async (route) => {
      console.log('MOCKING API CALL TO:', route.request().url());
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

test.describe('App Initialization', () => {
  test('should load navidrome configuration and call API with correct credentials', async ({
    page,
    isMobile,
  }) => {
    // 1. MockConfig con TUTTE le chiavi possibili (navidromeUrl + baseUrl per sicurezza)
    const mockConfig = {
      navidromeUrl: '/music', // Chiave standard
      baseUrl: '/music', // Tua chiave attuale
      user: 'test-user',
      token: 'test-token',
      salt: 'test-salt',
      version: '1.16.1',
      clientName: 'test-client',
    };

    await mockAudio(page);

    // Mock del config.json
    await page.route('**/assets/config.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        json: mockConfig,
      });
    });

    // Mock della risposta API Subsonic
    await page.route('**/music/rest/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          'subsonic-response': {
            status: 'ok',
            version: '1.16.1',
            randomSongs: {
              song: [{ id: '1', title: 'Test 1', artist: 'Artist 1', duration: 180 }],
            },
          },
        }),
      });
    });

    // 2. ESECUZIONE SINCRONIZZATA
    // Usiamo un filtro più ampio: basta che contenga lo username test-user
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes('u=test-user'), { timeout: 20000 }),
      page.goto('/', { waitUntil: 'networkidle' }),
    ]);

    // 3. VERIFICA UI
    const sidebar = page.locator('app-sidebar');
    if (isMobile) {
      // Su mobile deve essere nel DOM (attached)
      await expect(sidebar).toBeAttached();
      await expect(page.locator('app-tabs')).toBeVisible();
    } else {
      // Su desktop deve essere visibile
      await expect(sidebar).toBeVisible();
    }

    // 4. VERIFICA FINALE URL
    expect(request.url()).toContain('u=test-user');
    console.log('✅ App Init Success: Request URL is', request.url());
  });
});

// ═════════════════════════════════════════════════════════════
// Desktop View
// ═════════════════════════════════════════════════════════════
test.describe('Home Page - Desktop View', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await mockAudio(page);
    await mockRandomSongs(page, [
      { id: '1', title: 'Test Track 1', artist: 'Test Artist 1', album: 'Album 1', duration: 180 },
    ]);
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('app-sidebar', { state: 'attached', timeout: 30000 });
  });

  test('should display the sidebar and tracks', async ({ page }) => {
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('app-track-item')).toHaveCount(1, { timeout: 15000 });
  });

  test('should interact with the player controls after selecting a track', async ({ page }) => {
    const trackItem = page.locator('app-track-item').first();
    await trackItem.click();

    const player = page.locator('app-player');
    await expect(player.getByText('Test Track 1')).toBeVisible({ timeout: 10000 });

    const pauseButton = player.locator('button[aria-label="Pause"]');
    await expect(pauseButton).toBeVisible({ timeout: 15000 });

    await pauseButton.click();
    const playButton = player.locator('button[aria-label="Play"]');
    await expect(playButton).toBeVisible();

    await playButton.click();
    await expect(pauseButton).toBeVisible();
  });

  test('should control volume', async ({ page }) => {
    const volumeSlider = page.locator('input[aria-label="Volume"]');
    const muteButton = page.locator('button[aria-label="Mute/Unmute"]');

    await expect(muteButton).toBeVisible();

    await volumeSlider.fill('0.2');
    await expect(volumeSlider).toHaveValue('0.2');

    await muteButton.click();
    await expect(volumeSlider).toHaveValue('0');

    await muteButton.click();
    await expect(volumeSlider).toHaveValue('1');
  });

  test('should navigate to next and previous track', async ({ page }) => {
    await page.route('*/**/getRandomSongs.view*', async (route) => {
      await route.fulfill({
        json: {
          'subsonic-response': {
            status: 'ok',
            version: '1.16.1',
            randomSongs: {
              song: [
                { id: '1', title: 'Track One', artist: 'Artist A', duration: 120 },
                { id: '2', title: 'Track Two', artist: 'Artist B', duration: 200 },
              ],
            },
          },
        },
      });
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('app-track-item', { state: 'attached', timeout: 30000 });

    const player = page.locator('app-player');
    await page.locator('app-track-item').first().click();
    await expect(player.getByText('Track One')).toBeVisible({ timeout: 10000 });

    await player.locator('button[aria-label="Next track"]').click();
    await expect(player.getByText('Track Two')).toBeVisible({ timeout: 10000 });

    await player.locator('button[aria-label="Previous track"]').click();
    await expect(player.getByText('Track One')).toBeVisible({ timeout: 10000 });
  });

  test('should show progress seeker', async ({ page }) => {
    const seeker = page.locator('input[aria-label="Seek"]');
    await expect(seeker).toBeAttached();
  });
});

// ═════════════════════════════════════════════════════════════
// Mobile View
// ═════════════════════════════════════════════════════════════
test.describe('Home Page - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await mockAudio(page);
    await mockRandomSongs(page, [
      {
        id: '1',
        title: 'A Very Long Test Track Title',
        artist: 'Artist Name',
        duration: 180,
      },
    ]);
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('app-tabs', { state: 'attached', timeout: 30000 });
  });

  test('should display mobile layout: tabs visible, sidebar hidden', async ({ page }) => {
    await expect(page.locator('aside')).toBeHidden();
    await expect(page.locator('app-tabs')).toBeVisible();
  });

  test('should render a track in the list', async ({ page }) => {
    const trackItem = page.locator('app-track-item').first();
    await expect(trackItem).toBeVisible({ timeout: 15000 });
    await expect(trackItem.locator('span.text-white')).toContainText(
      'A Very Long Test Track Title',
    );
  });

  test('should show duration in track list', async ({ page }) => {
    const duration = page.locator('app-track-item').first().locator('span').last();
    await expect(duration).toHaveText('3:00');
  });

  test('should play a track and show player on mobile', async ({ page }) => {
    await page.locator('app-track-item').first().click();
    const player = page.locator('app-player');
    await expect(player.getByText('A Very Long Test Track Title')).toBeVisible({ timeout: 10000 });
  });

  test('should hide volume controls on mobile', async ({ page }) => {
    await expect(page.locator('button[aria-label="Mute/Unmute"]')).toBeHidden();
    await expect(page.locator('input[aria-label="Volume"]')).toBeHidden();
  });
});
