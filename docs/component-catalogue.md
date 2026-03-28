# Component Catalogue

> Visual reference for every design-system component, captured from Storybook. Regenerate with `npm run screenshots:components`.

## Contents

- [Level 1 — Atoms](#level-1--atoms): [DsButton](#dsbutton) · [DsTag](#dstag) · [DsInput](#dsinput) · [DsEmptyState](#dsemptystate)
- [Level 2 — Molecules](#level-2--molecules): [DsStatCard](#dsstatcard) · [DsSearchBar](#dssearchbar) · [DsFormField](#dsformfield)
- [Level 3 — Organisms](#level-3--organisms): [DsStatGrid](#dsstatgrid) · [DsProjectCardGrid](#dsprojectcardgrid) · [DsProjectTable](#dsprojecttable)
- [The Cascade in Practice](#the-cascade-in-practice)

---

## Level 1 — Atoms

Thin wrappers around a single PrimeNG primitive or native HTML element. Purely presentational, no business logic.

### DsButton
[`button.ts`](../src/app/design-system/atoms/button/button.ts) · [`button.stories.ts`](../src/app/design-system/atoms/button/button.stories.ts) · [`button.spec.ts`](../src/app/design-system/atoms/button/button.spec.ts)

| Primary | Secondary | Danger | Outlined |
|---|---|---|---|
| ![Primary](./screenshots/components/atoms/button-primary.png) | ![Secondary](./screenshots/components/atoms/button-secondary.png) | ![Danger](./screenshots/components/atoms/button-danger.png) | ![Outlined](./screenshots/components/atoms/button-outlined.png) |

### DsTag
[`tag.ts`](../src/app/design-system/atoms/tag/tag.ts) · [`tag.stories.ts`](../src/app/design-system/atoms/tag/tag.stories.ts) · [`tag.spec.ts`](../src/app/design-system/atoms/tag/tag.spec.ts)

| Success | Warning | Danger | Info |
|---|---|---|---|
| ![Success](./screenshots/components/atoms/tag-success.png) | ![Warning](./screenshots/components/atoms/tag-warning.png) | ![Danger](./screenshots/components/atoms/tag-danger.png) | ![Info](./screenshots/components/atoms/tag-info.png) |

### DsInput
[`input.ts`](../src/app/design-system/atoms/input/input.ts) · [`input.stories.ts`](../src/app/design-system/atoms/input/input.stories.ts) · [`input.spec.ts`](../src/app/design-system/atoms/input/input.spec.ts)

| Default | With placeholder |
|---|---|
| ![Default](./screenshots/components/atoms/input-default.png) | ![Placeholder](./screenshots/components/atoms/input-placeholder.png) |

### DsEmptyState
[`empty-state.ts`](../src/app/design-system/atoms/empty-state/empty-state.ts) · [`empty-state.stories.ts`](../src/app/design-system/atoms/empty-state/empty-state.stories.ts) · [`empty-state.spec.ts`](../src/app/design-system/atoms/empty-state/empty-state.spec.ts)

| Default (no action) | With action button |
|---|---|
| ![Default](./screenshots/components/atoms/empty-state-default.png) | ![With action](./screenshots/components/atoms/empty-state-action.png) |

---

## Level 2 — Molecules

Compositions of 2–4 atoms that function as a single reusable unit.

### DsStatCard
[`stat-card.ts`](../src/app/design-system/molecules/stat-card/stat-card.ts) · [`stat-card.stories.ts`](../src/app/design-system/molecules/stat-card/stat-card.stories.ts) · [`stat-card.spec.ts`](../src/app/design-system/molecules/stat-card/stat-card.spec.ts)

![StatCard](./screenshots/components/molecules/stat-card-default.png)

### DsSearchBar
[`search-bar.ts`](../src/app/design-system/molecules/search-bar/search-bar.ts) · [`search-bar.stories.ts`](../src/app/design-system/molecules/search-bar/search-bar.stories.ts) · [`search-bar.spec.ts`](../src/app/design-system/molecules/search-bar/search-bar.spec.ts)

![SearchBar](./screenshots/components/molecules/search-bar-default.png)

### DsFormField
[`form-field.ts`](../src/app/design-system/molecules/form-field/form-field.ts) · [`form-field.stories.ts`](../src/app/design-system/molecules/form-field/form-field.stories.ts) · [`form-field.spec.ts`](../src/app/design-system/molecules/form-field/form-field.spec.ts)

| Default | Full width |
|---|---|
| ![Default](./screenshots/components/molecules/form-field-default.png) | ![Full width](./screenshots/components/molecules/form-field-full-width.png) |

---

## Level 3 — Organisms

Complex, self-contained UI sections where real data enters. Every organism handles four states: loading, error, empty, and data.

### DsStatGrid
[`stat-grid.ts`](../src/app/design-system/organisms/stat-grid/stat-grid.ts) · [`stat-grid.html`](../src/app/design-system/organisms/stat-grid/stat-grid.html) · [`stat-grid.stories.ts`](../src/app/design-system/organisms/stat-grid/stat-grid.stories.ts) · [`stat-grid.spec.ts`](../src/app/design-system/organisms/stat-grid/stat-grid.spec.ts)

| Loading | Error |
|---|---|
| ![Loading](./screenshots/components/organisms/stat-grid-loading.png) | ![Error](./screenshots/components/organisms/stat-grid-error.png) |

| Empty | Data |
|---|---|
| ![Empty](./screenshots/components/organisms/stat-grid-empty.png) | ![Data](./screenshots/components/organisms/stat-grid-data.png) |

### DsProjectCardGrid
[`project-card-grid.ts`](../src/app/design-system/organisms/project-card-grid/project-card-grid.ts) · [`project-card-grid.html`](../src/app/design-system/organisms/project-card-grid/project-card-grid.html) · [`project-card-grid.stories.ts`](../src/app/design-system/organisms/project-card-grid/project-card-grid.stories.ts) · [`project-card-grid.spec.ts`](../src/app/design-system/organisms/project-card-grid/project-card-grid.spec.ts)

| Loading | Error |
|---|---|
| ![Loading](./screenshots/components/organisms/card-grid-loading.png) | ![Error](./screenshots/components/organisms/card-grid-error.png) |

| Empty | Data |
|---|---|
| ![Empty](./screenshots/components/organisms/card-grid-empty.png) | ![Data](./screenshots/components/organisms/card-grid-data.png) |

### DsProjectTable
[`project-table.ts`](../src/app/design-system/organisms/project-table/project-table.ts) · [`project-table.html`](../src/app/design-system/organisms/project-table/project-table.html) · [`project-table.stories.ts`](../src/app/design-system/organisms/project-table/project-table.stories.ts) · [`project-table.spec.ts`](../src/app/design-system/organisms/project-table/project-table.spec.ts)

| Loading | Error |
|---|---|
| ![Loading](./screenshots/components/organisms/table-loading.png) | ![Error](./screenshots/components/organisms/table-error.png) |

| Empty | Data |
|---|---|
| ![Empty](./screenshots/components/organisms/table-empty.png) | ![Data](./screenshots/components/organisms/table-data.png) |

| Search — no results |
|---|
| ![No results](./screenshots/components/organisms/table-no-results.png) |

---

## The Cascade in Practice

```
Atoms          →  DsButton, DsTag, DsInput, DsEmptyState
                      ↓
Molecules      →  DsStatCard (icon + value + label)
                   DsSearchBar (DsInput + DsButton)
                   DsFormField (label + ng-content)
                      ↓
Organisms      →  DsStatGrid (DsStatCard × N)
                   DsProjectCardGrid (DsTag + DsButton + avatars)
                   DsProjectTable (DsSearchBar + DsTag + DsButton + DsEmptyState + p-table)
                      ↓
Pages          →  Dashboard, List, Detail
```

Each level consumes components from the level below. Atoms never import molecules. Molecules never import organisms.
