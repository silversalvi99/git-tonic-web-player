import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  console.log('Starting authentication setup...');
  // 1. Navigate to the app
  await page.goto('/');
  console.log('Navigated to /');

  // 2. The app should redirect to Keycloak if not authenticated
  try {
    console.log('Waiting for Keycloak redirect...');
    // Broader pattern to match Keycloak login page
    await page.waitForURL((url) => url.href.includes('realms/'), { timeout: 30000 });
    console.log('Redirected to Keycloak:', page.url());
  } catch (e) {
    console.error('Failed to redirect to Keycloak. Current URL:', page.url());
    throw e;
  }

  const username = process.env.E2E_TEST_USERNAME || 'e2e-tester';
  const password = process.env.E2E_TEST_PASSWORD || '';

  // 4. Fill the login form
  // Standard Keycloak IDs are username, password, and kc-login
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('#kc-login');

  // 5. Wait for redirect back to the app
  await page.waitForURL('/home');

  // 6. Verify we are logged in (e.g. check for a specific element like sidebar)
  await expect(page.locator('app-sidebar')).toBeVisible({ timeout: 15000 });

  // 7. Save storage state
  await page.context().storageState({ path: authFile });
});
