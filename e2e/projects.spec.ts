import { test, expect } from '@playwright/test';

test.describe('List page', () => {
  test('renders the project table with rows', async ({ page }) => {
    await page.goto('/list');
    const tableRows = page.locator('p-table tr');
    await tableRows.first().waitFor();
    // Header row + at least 1 data row
    expect(await tableRows.count()).toBeGreaterThan(1);
  });
});

test.describe('Detail page', () => {
  test('shows project info for /detail/1', async ({ page }) => {
    await page.goto('/detail/1');
    // Wait for the project name to appear (first project is "Acme Redesign")
    await expect(page.getByRole('heading', { name: 'Acme Redesign' })).toBeVisible();
  });

  test('shows error state for /detail/999', async ({ page }) => {
    await page.goto('/detail/999');
    await expect(page.locator('p-message')).toBeVisible();
  });

  test('"Back to List" button navigates to /list', async ({ page }) => {
    await page.goto('/detail/999');
    await page.locator('p-message').waitFor();
    await page.getByRole('button', { name: 'Back to List' }).click();
    await expect(page).toHaveURL(/\/list$/);
  });
});
