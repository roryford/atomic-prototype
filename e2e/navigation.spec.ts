import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('root redirects to /dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('clicking "List" nav link navigates to /list', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('.nav-links').getByRole('button', { name: 'List' }).click();
    await expect(page).toHaveURL(/\/list$/);
  });

  test('clicking "Dashboard" nav link navigates to /dashboard', async ({ page }) => {
    await page.goto('/list');
    await page.locator('.nav-links').getByRole('button', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('unknown route falls back to root and redirects to /dashboard', async ({ page }) => {
    await page.goto('/nonexistent');
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
