import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────
// Helper: mock Audio API so play() / pause() never throw
// ─────────────────────────────────────────────────────────────
async function mockAudio(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    window.Audio.prototype.play = () => Promise.resolve();
    window.Audio.prototype.pause = () => {};
  });
}

// ─────────────────────────────────────────────────────────────
// Helper: mock the random-songs API endpoint
// ─────────────────────────────────────────────────────────────
async function mockRandomSongs(
  page: import('@playwright/test').Page,
  songs: object[] = [
    {
      id: '1',
      title: 'Test Track 1',
      artist: 'Test Artist 1',
      album: 'Album 1',
      duration: 180,
      coverArt: 'cover1',
    },
  ],
) {
  await page.route('**/getRandomSongs.view*', async (route) => {
    await route.fulfill({
      json: {
        'subsonic-response': {
          status: 'ok',
          version: '1.16.1',
          randomSongs: { song: songs },
        },
      },
    });
  });
}

// ═════════════════════════════════════════════════════════════
// Desktop View – force a 1280×800 viewport so these tests pass
// on every browser project (including Mobile Chrome/Safari).
// ═════════════════════════════════════════════════════════════
test.describe('Home Page - Desktop View', () => {
  // Force desktop-sized viewport regardless of browser project
  test.use({ viewport: { width: 1280, height: 800 } });

  test.beforeEach(async ({ page }) => {
    await mockAudio(page);
    await mockRandomSongs(page);
    await page.goto('/');
    await page.waitForSelector('app-sidebar', { state: 'attached', timeout: 30000 });
  });

  test('should display the sidebar and tracks', async ({ page }) => {
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('app-track-item')).toHaveCount(1, { timeout: 15000 });
  });

  test('should interact with the player controls after selecting a track', async ({ page }) => {
    // 1. Click track
    const trackItem = page.locator('app-track-item').first();
    await trackItem.click();

    // 2. Verify track name in player
    const player = page.locator('app-player');
    await expect(player.getByText('Test Track 1')).toBeVisible({ timeout: 10000 });

    // 3. Pause button should appear after clicking a track (isPlaying = true)
    const pauseButton = player.locator('button[aria-label="Pause"]');
    await expect(pauseButton).toBeVisible({ timeout: 15000 });

    // 4. Click Pause → Play button should appear
    await pauseButton.click();
    const playButton = player.locator('button[aria-label="Play"]');
    await expect(playButton).toBeVisible();

    // 5. Click Play → Pause button should reappear
    await playButton.click();
    await expect(pauseButton).toBeVisible();
  });

  test('should control volume', async ({ page }) => {
    const volumeSlider = page.locator('input[aria-label="Volume"]');
    const muteButton = page.locator('button[aria-label="Mute/Unmute"]');

    // Mute button is visible on desktop
    await expect(muteButton).toBeVisible();

    // Change volume to 0.2
    await volumeSlider.fill('0.2');
    await expect(volumeSlider).toHaveValue('0.2');

    // Mute: volume → 0
    await muteButton.click();
    await expect(volumeSlider).toHaveValue('0');

    // Unmute: volume → 1
    await muteButton.click();
    await expect(volumeSlider).toHaveValue('1');
  });

  test('should navigate to next and previous track', async ({ page }) => {
    // Set up a queue with 2 tracks
    await page.route('**/getRandomSongs.view*', async (route) => {
      await route.fulfill({
        json: {
          'subsonic-response': {
            status: 'ok',
            version: '1.16.1',
            randomSongs: {
              song: [
                {
                  id: '1',
                  title: 'Track One',
                  artist: 'Artist A',
                  album: 'Album A',
                  duration: 120,
                },
                {
                  id: '2',
                  title: 'Track Two',
                  artist: 'Artist B',
                  album: 'Album B',
                  duration: 200,
                },
              ],
            },
          },
        },
      });
    });
    await page.goto('/');
    await page.waitForSelector('app-track-item', { state: 'attached', timeout: 30000 });
    await expect(page.locator('app-track-item')).toHaveCount(2, { timeout: 15000 });

    const player = page.locator('app-player');

    // Play first track
    await page.locator('app-track-item').first().click();
    await expect(player.getByText('Track One')).toBeVisible({ timeout: 10000 });

    // Next track
    await player.locator('button[aria-label="Next track"]').click();
    await expect(player.getByText('Track Two')).toBeVisible({ timeout: 10000 });

    // Previous track
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
        title: 'A Very Long Test Track Title That Should Be Visible',
        artist: 'Artist Name',
        album: 'Album',
        duration: 180,
      },
    ]);
    await page.goto('/');
    await page.waitForSelector('main', { state: 'attached', timeout: 30000 });
  });

  test('should display mobile layout: tabs visible, sidebar hidden', async ({ page }) => {
    await expect(page.locator('aside')).toBeHidden();
    await expect(page.locator('app-tabs')).toBeVisible();
  });

  test('should render a track in the list', async ({ page }) => {
    const trackItem = page.locator('app-track-item').first();
    await expect(trackItem).toBeVisible({ timeout: 15000 });

    // Track title and artist should be present
    const title = trackItem.locator('span.text-white');
    await expect(title).toBeVisible();
    await expect(title).toContainText('A Very Long Test Track Title That Should Be Visible');
  });

  test('should show duration in track list', async ({ page }) => {
    const duration = page.locator('app-track-item').first().locator('span').last();
    await expect(duration).toBeVisible({ timeout: 15000 });
    // Duration of 180s → "3:00"
    await expect(duration).toHaveText('3:00');
  });

  test('should play a track and show player on mobile', async ({ page }) => {
    await page.locator('app-track-item').first().click();

    const player = page.locator('app-player');
    await expect(
      player.getByText('A Very Long Test Track Title That Should Be Visible'),
    ).toBeVisible({ timeout: 10000 });

    // Play/Pause button is always visible (not desktop-only)
    const pauseButton = player.locator('button[aria-label="Pause"]');
    await expect(pauseButton).toBeVisible({ timeout: 15000 });
  });

  test('should hide volume controls on mobile', async ({ page }) => {
    // Volume slider and mute button are inside a "hidden md:flex" container
    await expect(page.locator('button[aria-label="Mute/Unmute"]')).toBeHidden();
    await expect(page.locator('input[aria-label="Volume"]')).toBeHidden();
  });
});
