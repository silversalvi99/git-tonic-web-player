import { test, expect, mockRandomSongs } from './fixtures';

test.describe('Player Repeat Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Mock 2 songs to test queue progression
    await mockRandomSongs(page, [
      { id: '1', title: 'Track 1', artist: 'Artist 1', duration: 180 },
      { id: '2', title: 'Track 2', artist: 'Artist 2', duration: 120 },
    ]);
    await page.goto('/');
    // Start playback
    await page.locator('app-track-item').first().click();
  });

  test('should cycle repeat modes in mini player', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'Repeat control is hidden on mobile');
    const miniPlayer = page.locator('app-mini-player');
    const repeatBtn = miniPlayer.getByTestId('player-repeat');

    // Default mode: 'none'
    await expect(repeatBtn).not.toHaveClass(/text-indigo-600/);

    // Toggle to 'all'
    await repeatBtn.click();
    await expect(repeatBtn).toHaveClass(/text-indigo-600/);

    // Toggle to 'one'
    await repeatBtn.click();
    await expect(repeatBtn.locator('span')).toHaveText('1');
    await expect(repeatBtn).toHaveClass(/text-indigo-600/);

    // Toggle back to 'none'
    await repeatBtn.click();
    await expect(repeatBtn).not.toHaveClass(/text-indigo-600/);
    await expect(repeatBtn.locator('span')).toBeHidden();
  });

  test('should cycle repeat modes in expanded player', async ({ page }) => {
    // Open expanded player
    await page.getByTestId('mini-player-track-info').click();
    const expandedPlayer = page.getByTestId('expanded-player-overlay');
    await expect(expandedPlayer).toBeVisible();

    const repeatBtn = expandedPlayer.getByTestId('player-repeat');
    const indicator = repeatBtn.locator('div.bg-white');

    // Default mode: 'none'
    await expect(repeatBtn).toHaveClass(/text-white\/30/);
    await expect(indicator).toHaveClass(/opacity-0/);

    // Toggle to 'all'
    await repeatBtn.click();
    await expect(repeatBtn).toHaveClass(/text-white/);
    await expect(repeatBtn).not.toHaveClass(/text-white\/30/);
    await expect(indicator).toHaveClass(/opacity-100/);

    // Toggle to 'one'
    await repeatBtn.click();
    await expect(repeatBtn.locator('span')).toHaveText('1');

    // Toggle back to 'none'
    await repeatBtn.click();
    await expect(repeatBtn).toHaveClass(/text-white\/30/);
    await expect(indicator).toHaveClass(/opacity-0/);
  });

  test('should verify Media Session API exists in browser', async ({ page, browserName }) => {
    // Playwright's headless WebKit (Mobile Safari) often does not expose MediaSession API
    test.skip(browserName === 'webkit', 'Media Session API is not exposed in headless WebKit');

    const hasMediaSession = await page.evaluate(() => 'mediaSession' in navigator);
    expect(hasMediaSession).toBe(true);
  });
});
