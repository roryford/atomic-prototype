import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * MSW request-interception server for Node/jsdom (Vitest) test runs.
 *
 * The browser worker (`browser.ts`) cannot intercept requests under jsdom, so
 * unit tests reuse the same {@link handlers} through `setupServer`. Specs that
 * exercise `httpResource`-backed components start this server in `beforeAll`,
 * reset it between tests, and close it in `afterAll` so handler overrides (e.g.
 * forcing a 500 to test the error branch) don't leak across tests.
 */
export const server = setupServer(...handlers);
