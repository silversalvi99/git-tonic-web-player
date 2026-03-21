import { test, expect } from '@playwright/test';

async function mockAudio(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    window.Audio.prototype.play = () => Promise.resolve();
    window.Audio.prototype.pause = () => {};
    // Force English language for tests
    localStorage.setItem('gin_tonic_settings', JSON.stringify({ language: 'en' }));
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

    const playPauseButton = page.getByTestId('player-play-pause');
    await expect(playPauseButton).toBeVisible({ timeout: 15000 });

    await playPauseButton.click();
    await expect(playPauseButton).toHaveAttribute('aria-label', 'Play');

    await playPauseButton.click();
    await expect(playPauseButton).toHaveAttribute('aria-label', 'Pause');
  });

  test('should control volume', async ({ page }) => {
    await page.locator('app-track-item').first().click();

    const volumeSlider = page.getByTestId('player-volume');
    const muteButton = page.getByTestId('player-mute');

    await expect(muteButton).toBeVisible();

    await volumeSlider.evaluate((el: HTMLInputElement) => {
      el.value = '0.2';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await expect(volumeSlider).toHaveValue('0.2');

    await muteButton.click();
    await expect(volumeSlider).toHaveValue('0');

    await muteButton.click();

    await expect(volumeSlider).not.toHaveValue('0');
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

    const miniPlayer = page.locator('app-mini-player');
    await page.locator('app-track-item').first().click();
    await expect(miniPlayer.getByText('Track One')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('player-next').click();
    await expect(miniPlayer.getByText('Track Two')).toBeVisible({ timeout: 10000 });

    await page.getByTestId('player-prev').click();
    await expect(miniPlayer.getByText('Track One')).toBeVisible({ timeout: 10000 });
  });

  test('should show progress seeker', async ({ page }) => {
    // 1. Play a track to show player
    await page.locator('app-track-item').first().click();

    const seeker = page.getByTestId('player-seek').first();
    await expect(seeker).toBeAttached();
  });

  test('should open expanded mode and verify adaptive colors', async ({ page }) => {
    // 1. Play a track to show player
    await page.locator('app-track-item').first().click();

    // 2. Click track info (proven reliable)
    await page.waitForTimeout(1000);
    await page.getByTestId('mini-player-track-info').click();

    // 3. Verify expanded player is visible
    const overlay = page.getByTestId('expanded-player-overlay');
    await expect(overlay).toBeVisible({ timeout: 15000 });

    // 4. Verify track info in expanded mode
    await expect(page.getByTestId('expanded-player-title')).toBeVisible();

    // 5. Verify the background color is set (linear-gradient)
    await expect(overlay).toHaveAttribute('style', /background: linear-gradient/);

    // 6. Close expanded mode
    await page.getByTestId('expanded-player-close').click();
    await expect(page.locator('app-expanded-player')).toBeHidden();
    await expect(page.locator('app-mini-player')).toBeVisible();
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
    await expect(trackItem.locator('span.truncate').first()).toContainText(
      'A Very Long Test Track Title',
      { ignoreCase: true },
    );
  });

  test('should show duration in track list', async ({ page }) => {
    const duration = page.locator('app-track-item').first().locator('span').last();
    await expect(duration).toHaveText('3:00');
  });

  test('should play a track and show mini-player on mobile', async ({ page }) => {
    await page.locator('app-track-item').first().click();
    const miniPlayer = page.locator('app-mini-player');
    await expect(miniPlayer.getByText('A Very Long Test Track Title')).toBeVisible({
      timeout: 10000,
    });
  });

  test('should show horizontal layout on mobile', async ({ page }) => {
    await page.locator('app-track-item').first().click();
    const miniPlayer = page.locator('app-mini-player');

    // The root div of mini-player always has flex-row now as requested
    const container = miniPlayer.locator('div').first();
    await expect(container).toHaveClass(/flex-row/);
  });

  test('should hide volume controls in mini-player on mobile', async ({ page }) => {
    await page.locator('app-track-item').first().click();
    const miniPlayer = page.locator('app-mini-player');
    await expect(page.getByTestId('player-volume')).toBeHidden();
  });

  test('should open expanded mode on mobile', async ({ page }) => {
    // 1. Play a track
    await page.locator('app-track-item').first().click();

    // 2. Click track info using test id
    await page.waitForTimeout(1000);
    await page.getByTestId('mini-player-track-info').first().click();

    // 3. Verify expanded player is visible
    const overlay = page.getByTestId('expanded-player-overlay');
    await expect(overlay).toBeVisible({ timeout: 15000 });
  });
});
