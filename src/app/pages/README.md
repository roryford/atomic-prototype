# Pages

Routed components that wire services to organisms. Pages are the top of the atomic hierarchy — they own the data lifecycle and compose organisms into complete views.

## Pages

| Page | Route | Key Organisms |
|------|-------|--------------|
| [Dashboard](./dashboard/dashboard.ts) | `/dashboard` | DsStatGrid, DsProjectCardGrid |
| [List](./list/list.ts) | `/list` | DsProjectTable |
| [Detail](./detail/detail.ts) | `/detail/:id` | Form fields (read-only) |

## Pattern

Each page injects `ProjectService`, which uses `httpResource()` for signal-based data fetching. Pages pass resource signals (value, error, isLoading) as inputs to organisms. Pages contain no presentation logic — that lives in the organisms.

All routes are lazy-loaded via `loadComponent` in `app.routes.ts`.

See [01-atomic-hierarchy § Level 5](../../docs/01-atomic-hierarchy.md) for the full page definition.
