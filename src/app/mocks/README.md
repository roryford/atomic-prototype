# Mocks

API mocking via [MSW (Mock Service Worker)](https://mswjs.io/) v2. MSW intercepts fetch requests at the network level — `httpResource()` and Angular's HttpClient don't know they're talking to mocks.

## Structure

- **browser.ts** — MSW browser worker setup
- **handlers.ts** — API route handlers (`/api/projects`, `/api/projects/:id`, `/api/stats`)
- **fixtures/** — JSON fixture data (projects, stats)

## How It Works

MSW is conditionally started in `main.ts` via `isDevMode()` + dynamic `import()`. Mock code is tree-shaken from production builds — zero runtime cost.

Handlers simulate realistic API latency (200-300ms delays).

See [11-implementation-tips](../../docs/11-implementation-tips.md) for the full MSW setup guide.
