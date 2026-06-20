import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

/**
 * Atom-level steps (Atomic Design — Level 1).
 *
 * These steps interact with the smallest building blocks — a single button
 * (DsButton), a heading — by their visible text. They are the lowest-altitude
 * vocabulary and the most reusable across screens.
 * See docs/01-atomic-hierarchy.md § Level 1.
 */
const { When, Then } = createBdd();

When('I click the {string} button', async ({ page }, name: string) => {
  await page.getByRole('button', { name }).click();
});

Then('I should see the project named {string}', async ({ page }, name: string) => {
  // The detail page renders the project's name as the entity-title heading.
  await expect(page.getByRole('heading', { name })).toBeVisible();
});
