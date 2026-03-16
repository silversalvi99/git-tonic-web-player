import { test, expect } from '@playwright/test';

test.describe('Home Page - Desktop View', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.Audio.prototype.play = () => Promise.resolve();
      window.Audio.prototype.pause = () => {};
    });

    await page.route('**/getRandomSongs.view*', async (route) => {
      const json = {
        'subsonic-response': {
          status: 'ok',
          version: '1.16.1',
          randomSongs: {
            song: [
              { id: '1', title: 'Test Track 1', artist: 'Test Artist 1', album: 'Album 1', duration: 180, coverArt: 'cover1' },
            ],
          },
        },
      };
      await route.fulfill({ json });
    });

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

    // 3. Check for the Pause button (it should be visible after clicking a track)
    // We search across all buttons in the player for one with aria-label Pause
    const pauseButton = player.locator('button[aria-label="Pause"]');
    await expect(pauseButton).toBeVisible({ timeout: 15000 });

    // 4. Click Pause and verify it turns into Play
    await pauseButton.click();
    const playButton = player.locator('button[aria-label="Play"]');
    await expect(playButton).toBeVisible();

    // 5. Click Play and verify it turns into Pause
    await playButton.click();
    await expect(pauseButton).toBeVisible();
  });

  test('should control volume', async ({ page }) => {
    const volumeSlider = page.locator('input[aria-label="Volume"]');
    const muteButton = page.locator('button[aria-label="Mute/Unmute"]');

    // Default volume should be visible (icon state)
    await expect(muteButton).toBeVisible();

    // Change volume
    await volumeSlider.fill('0.2');
    // Verify icon change if possible, or just interaction
    await expect(volumeSlider).toHaveValue('0.2');

    // Test mute
    await muteButton.click();
    await expect(volumeSlider).toHaveValue('0');

    await muteButton.click();
    await expect(volumeSlider).toHaveValue('1');
  });
});

test.describe('Home Page - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.route('**/getRandomSongs.view*', async (route) => {
      const json = {
        'subsonic-response': {
          status: 'ok',
          version: '1.16.1',
          randomSongs: { song: [{ id: '1', title: 'A Very Long Test Track Title That Should Be Visible', artist: 'Artist Name', album: 'Album', duration: 180 }] },
        },
      };
      await route.fulfill({ json });
    });

    await page.goto('/');
    await page.waitForSelector('main', { state: 'attached', timeout: 30000 });
  });

  test('should display mobile layout and visible track info', async ({ page }) => {
    await expect(page.locator('aside')).toBeHidden();
    await expect(page.locator('app-tabs')).toBeVisible();
    
    // Check track info visibility
    const trackTitle = page.locator('app-track-item').first().locator('.text-white');
    await expect(trackTitle).toBeVisible();
    await expect(trackTitle).not.toHaveCSS('display', 'none');
    
    // Duration should be visible but short
    const duration = page.locator('app-track-item').first().locator('span').last();
    await expect(duration).toBeVisible();
  });
});
