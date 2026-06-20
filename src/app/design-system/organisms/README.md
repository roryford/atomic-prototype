# Organisms

Data-aware sections that handle multiple render states. List/collection organisms follow the same state machine pattern:

1. **Loading** — skeleton placeholders
2. **Error** — error message + retry button
3. **Empty** — empty state message
4. **Data** — normal rendering

Some organisms add additional states (e.g., search-no-results).

Detail/single-record organisms (e.g. `DsProjectDetailCard`) take a guaranteed input and render only the **data** state — the page that resolves the record owns the loading/error/empty handling before the organism is shown.

## Components

| Component | Key Feature | States |
|-----------|------------|--------|
| [DsStatGrid](./stat-grid/stat-grid.ts) | KPI card grid | loading, error, empty, data |
| [DsProjectCardGrid](./project-card-grid/project-card-grid.ts) | Clickable project cards | loading, error, empty, data |
| [DsProjectTable](./project-table/project-table.ts) | Searchable, sortable table | loading, error, empty, search-no-results, data |
| [DsProjectDetailCard](./project-detail-card/project-detail-card.ts) | Single-project detail card (Avatar, Divider, fields, back action) | data (page owns loading/error/empty) |

## Key Pattern

Organisms receive data via inputs — they don't fetch it. The parent page owns the data lifecycle; the organism owns presentation and filtering. Uses `signal()` for local state and `computed()` for derived state.

See [01-atomic-hierarchy § Level 3](../../docs/01-atomic-hierarchy.md) for the full organism definition and [07-qa-per-atomic-level](../../docs/07-qa-per-atomic-level.md) for testing requirements.
