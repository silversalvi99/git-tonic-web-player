import { test, expect } from './fixtures';

test.describe('Logout E2E', () => {
  test('should redirect to Keycloak logout/login page when clicking logout', async ({ page }) => {
    // 1. Navigate to settings
    await page.goto('/settings', { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/settings');

    // 2. Locate the logout button
    const logoutButton = page.getByTestId('logout-button');
    await logoutButton.waitFor({ state: 'visible', timeout: 10000 });

    // 3. Click logout and wait for redirect
    // We expect to be redirected to Keycloak (URL containing 'realms/')
    await logoutButton.click();

    console.log('Clicked logout, waiting for redirect...');

    // 4. Verify redirection to Keycloak
    // Keycloak logout usually redirects to a page with 'realms/' in the URL
    // or back to the app if redirected immediately, but usually it hits Keycloak first.
    await page.waitForURL((url) => url.href.includes('realms/'), { timeout: 30000 });

    expect(page.url()).toContain('realms/');
    console.log('Successfully redirected to Keycloak:', page.url());
  });
});
