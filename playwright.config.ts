import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Generate Playwright tests from Gherkin .feature files. Non-technical authors
// write plain-English scenarios in e2e/features/; the matching step code lives
// in e2e/steps/. Run `npm run e2e:bdd` (or `npm run e2e`) — the `bddgen` step
// compiles features into runnable tests before Playwright executes them.
const bddTestDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: 'e2e/steps/**/*.ts',
});

export default defineConfig({
  testIgnore: ['storybook-screenshots.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    // Gherkin/BDD specs (generated from e2e/features/**).
    {
      name: 'bdd',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'] },
    },
    // Plain Playwright specs that aren't behavioral (e.g. screenshot capture).
    {
      name: 'e2e',
      testDir: './e2e',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx ng serve',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
});
