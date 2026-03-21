import { test, expect } from '@playwright/test';

test.describe('Settings and Theme E2E', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigazione con attesa del caricamento base
    await page.goto('/settings', { waitUntil: 'domcontentloaded' });

    // 2. Gestione del Lazy Loading: Aspettiamo che l'URL sia stabilizzato
    // Angular potrebbe fare dei redirect interni (es. da '' a /home e poi a /settings)
    await page.waitForURL('**/settings');

    // 3. Aspettiamo che il componente Settings sia effettivamente renderizzato
    // Usiamo il testid della select come segnale che il componente lazy è "vivo"
    await page.getByTestId('language-select').waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should change language and persist after reload', async ({ page }) => {
    const languageSelect = page.getByTestId('language-select');

    // Aspettiamo che le opzioni siano popolate (fondamentale per @for)
    await expect(languageSelect.locator('option')).not.toHaveCount(0);

    // Cambiamo in inglese
    await languageSelect.selectOption('en');

    // Verifica il titolo (usiamo h2 o h1 in base al tuo template)
    // toContainText riprova automaticamente se la traduzione ci mette un istante a caricare
    await expect(page.locator('h1, h2').first()).toContainText('Settings', { timeout: 7000 });

    // Verifica la persistenza tecnica nel localStorage
    const lang = await page.evaluate(() => {
      const saved = localStorage.getItem('gin_tonic_settings');
      return saved ? JSON.parse(saved).language : null;
    });
    expect(lang).toBe('en');
  });

  test('should change theme and apply correct class', async ({ page }) => {
    const html = page.locator('html');

    // Usiamo getByRole o getByText per cliccare sulle opzioni del tema
    await page.getByText('Light', { exact: true }).click();
    await expect(html).not.toHaveClass(/dark/);

    await page.getByText('Dark', { exact: true }).click();
    await expect(html).toHaveClass(/dark/);

    // Persistence check dopo il ricaricamento
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/settings');
    await expect(html).toHaveClass(/dark/);
  });

  test('should show smooth transition class during theme switch', async ({ page }) => {
    const body = page.locator('body');

    // Clicca per cambiare tema
    await page.getByText('Light', { exact: true }).click();

    // La classe dura solo 500ms. toHaveClass la intercetta se il test è veloce.
    // Se fallisce qui perché è "troppo lenta", Playwright lo segnalerà.
    await expect(body).toHaveClass(/theme-transitioning/);

    // Verifica che venga rimossa (timeout di sicurezza per l'animazione)
    await expect(body).not.toHaveClass(/theme-transitioning/, { timeout: 3000 });
  });
});
