# Pages

Routed components that wire services to organisms. Pages are the top of the atomic hierarchy — they own the data lifecycle and compose organisms into complete views, projected into a [template](../design-system/templates/README.md) layout shell.

## Pages

| Page | Route | Template | Key Organisms |
|------|-------|----------|--------------|
| [Dashboard](./dashboard/dashboard.ts) | `/dashboard` | DsDashboardLayout | DsStatGrid, DsProjectCardGrid |
| [List](./list/list.ts) | `/list` | DsFullWidthLayout | DsProjectTable |
| [Detail](./detail/detail.ts) | `/detail/:id` | DsFullWidthLayout (narrow) | Form fields (read-only) |

## Pattern

Each page injects `ProjectService`, which uses `httpResource()` for signal-based data fetching. Pages pass resource signals (value, error, isLoading) as inputs to organisms, and project those organisms into a template shell that owns all spatial layout. Pages contain no presentation or layout logic — presentation lives in the organisms, spatial structure lives in the template.

Stories for each page (`*.stories.ts`) drive every render state by providing a `projectServiceMock` (see [`mock-project-service.ts`](./mock-project-service.ts)) instead of a live backend.

All routes are lazy-loaded via `loadComponent` in `app.routes.ts`.

See [01-atomic-hierarchy § Level 5](../../docs/01-atomic-hierarchy.md) for the full page definition.
