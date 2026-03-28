import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('renders stat cards', async ({ page }) => {
    const statCards = page.locator('.stat-card');
    await statCards.first().waitFor();
    await expect(statCards).toHaveCount(4);
  });

  test('renders project cards after loading', async ({ page }) => {
    const projectCards = page.locator('.project-card');
    await projectCards.first().waitFor();
    expect(await projectCards.count()).toBeGreaterThanOrEqual(1);
  });

  test('clicking a project card navigates to detail page', async ({ page }) => {
    const firstCard = page.locator('.project-card').first();
    await firstCard.waitFor();
    await firstCard.click();
    await expect(page).toHaveURL(/\/detail\/\d+$/);
  });
});
