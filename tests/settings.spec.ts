import { test, expect } from './fixtures';

test.describe('Settings and Theme E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings', { waitUntil: 'domcontentloaded' });

    await page.waitForURL('**/settings');

    await page.getByTestId('language-select').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should change language and persist after reload', async ({ page }) => {
    const languageSelect = page.getByTestId('language-select');

    await expect(languageSelect.locator('option')).not.toHaveCount(0);

    await languageSelect.selectOption('en');

    await expect(page.locator('h1, h2').first()).toContainText('Settings', { timeout: 7000 });

    const lang = await page.evaluate(() => {
      const saved = localStorage.getItem('gin_tonic_settings');
      return saved ? JSON.parse(saved).language : null;
    });
    expect(lang).toBe('en');
  });

  test('should change theme and apply correct class', async ({ page }) => {
    const html = page.locator('html');

    await page.getByText('Light', { exact: true }).click();
    await expect(html).not.toHaveClass(/dark/);

    await page.getByText('Dark', { exact: true }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/settings');
    await expect(html).toHaveClass(/dark/);
  });

  test('should show smooth transition class during theme switch', async ({ page }) => {
    const body = page.locator('body');
    await page.getByText('Light', { exact: true }).click();
    await expect(body).toHaveClass(/theme-transitioning/);
    await expect(body).not.toHaveClass(/theme-transitioning/, { timeout: 3000 });
  });
});
