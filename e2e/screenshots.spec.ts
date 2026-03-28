import { test, expect } from '@playwright/test';

/**
 * Screenshot capture tests for documentation.
 * Run: npx playwright test e2e/screenshots.spec.ts
 * Output: docs/screenshots/
 */

test.describe('Documentation screenshots', () => {
  // 1. Dashboard light mode — hero image for quickstart
  test('dashboard light mode', async ({ page }) => {
    await page.goto('/dashboard');
    // Ensure dark mode is off
    await page.evaluate(() =>
      document.documentElement.classList.remove('dark-mode'),
    );
    // Wait for data to load
    await page.locator('.stat-card').first().waitFor();
    await page.locator('.project-card').first().waitFor();
    await page.screenshot({
      path: 'docs/screenshots/dashboard-light.png',
      fullPage: true,
    });
  });

  // 2. Dashboard dark mode — for token pipeline doc
  test('dashboard dark mode', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('.stat-card').first().waitFor();
    await page.locator('.project-card').first().waitFor();
    // Toggle dark mode
    await page.evaluate(() =>
      document.documentElement.classList.add('dark-mode'),
    );
    // Let PrimeNG CSS vars settle
    await page.waitForTimeout(300);
    await page.screenshot({
      path: 'docs/screenshots/dashboard-dark.png',
      fullPage: true,
    });
  });

  // 3. List page with table — most complex organism
  test('list page with table', async ({ page }) => {
    await page.goto('/list');
    await page.locator('p-table tr').first().waitFor();
    await page.screenshot({
      path: 'docs/screenshots/list-table.png',
      fullPage: true,
    });
  });

  // 4. Detail page
  test('detail page', async ({ page }) => {
    await page.goto('/detail/1');
    await page
      .getByRole('heading', { name: 'Acme Redesign' })
      .waitFor();
    await page.screenshot({
      path: 'docs/screenshots/detail-page.png',
      fullPage: true,
    });
  });

  // 5. Error state — detail 404
  test('detail error state', async ({ page }) => {
    await page.goto('/detail/999');
    await page.locator('p-message').waitFor();
    await page.screenshot({
      path: 'docs/screenshots/detail-error.png',
      fullPage: true,
    });
  });

  // 6. Responsive — dashboard at mobile width (1 column)
  test('dashboard mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/dashboard');
    await page.locator('.stat-card').first().waitFor();
    await page.locator('.project-card').first().waitFor();
    await page.screenshot({
      path: 'docs/screenshots/dashboard-mobile.png',
      fullPage: true,
    });
  });

  // 7. Responsive — dashboard at wide width (4 columns)
  test('dashboard wide', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dashboard');
    await page.locator('.stat-card').first().waitFor();
    await page.locator('.project-card').first().waitFor();
    await page.screenshot({
      path: 'docs/screenshots/dashboard-wide.png',
      fullPage: true,
    });
  });
});
