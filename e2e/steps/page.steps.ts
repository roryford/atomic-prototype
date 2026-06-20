import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

/**
 * Page-level steps (Atomic Design — Level 5).
 *
 * These steps exercise whole routed pages and navigation between them. They are
 * the highest-altitude vocabulary a scenario can use: "open the dashboard",
 * "I should be on the List page". See docs/01-atomic-hierarchy.md § Level 5.
 */
const { Given, When, Then } = createBdd();

// Human-readable page name -> the URL it should resolve to.
const pageUrls: Record<string, RegExp> = {
  Dashboard: /\/dashboard$/,
  List: /\/list$/,
};

Given('I open the app', async ({ page }) => {
  await page.goto('/');
});

Given('I open the dashboard', async ({ page }) => {
  await page.goto('/dashboard');
});

Given('I open the projects list', async ({ page }) => {
  await page.goto('/list');
});

When('I open an unknown route', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
});

When('I open project {string}', async ({ page }, id: string) => {
  await page.goto(`/detail/${id}`);
});

When('I click the {string} navigation link', async ({ page }, name: string) => {
  await page.locator('.nav-links').getByRole('button', { name }).click();
});

Then('I should be on the {string} page', async ({ page }, name: string) => {
  const url = pageUrls[name];
  expect(url, `No URL mapping for page "${name}" — add it to pageUrls`).toBeTruthy();
  await expect(page).toHaveURL(url);
});

Then('I should be on a project detail page', async ({ page }) => {
  await expect(page).toHaveURL(/\/detail\/\d+$/);
});
