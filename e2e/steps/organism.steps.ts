import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

/**
 * Organism-level steps (Atomic Design — Level 3).
 *
 * These steps assert on data-aware sections (stat grid, project card grid) and
 * interactions within them. They sit one level below page steps: a page is
 * composed of organisms. See docs/01-atomic-hierarchy.md § Level 3.
 */
const { When, Then } = createBdd();

Then('I should see the stat cards', async ({ page }) => {
  const cards = page.locator('.stat-card');
  await cards.first().waitFor();
  await expect(cards).toHaveCount(4);
});

Then('I should see the project cards', async ({ page }) => {
  const cards = page.locator('.project-card');
  await cards.first().waitFor();
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
});

When('I click the first project card', async ({ page }) => {
  const card = page.locator('.project-card').first();
  await card.waitFor();
  await card.click();
});

Then('I should see the project table with at least one project', async ({ page }) => {
  // DsProjectTable renders a PrimeNG p-table: header row + one row per project.
  const rows = page.locator('p-table tr');
  await rows.first().waitFor();
  expect(await rows.count()).toBeGreaterThan(1);
});

Then('I should see an error message', async ({ page }) => {
  await expect(page.locator('p-message')).toBeVisible();
});
