import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Storybook component screenshots.
 * Starts Storybook on :6006 and captures each component in isolation.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: 'storybook-screenshots.spec.ts',
  fullyParallel: true,
  retries: 0,
  workers: 3,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:6006',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx ng run atomic-prototype:storybook --ci',
    url: 'http://localhost:6006',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
