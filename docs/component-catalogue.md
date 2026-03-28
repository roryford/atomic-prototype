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

| Primary | Secondary | Danger | Outlined |
|---|---|---|---|
| ![Primary](./screenshots/components/atoms/button-primary.png) | ![Secondary](./screenshots/components/atoms/button-secondary.png) | ![Danger](./screenshots/components/atoms/button-danger.png) | ![Outlined](./screenshots/components/atoms/button-outlined.png) |

### DsTag

| Success | Warning | Danger | Info |
|---|---|---|---|
| ![Success](./screenshots/components/atoms/tag-success.png) | ![Warning](./screenshots/components/atoms/tag-warning.png) | ![Danger](./screenshots/components/atoms/tag-danger.png) | ![Info](./screenshots/components/atoms/tag-info.png) |

### DsInput

| Default | With placeholder |
|---|---|
| ![Default](./screenshots/components/atoms/input-default.png) | ![Placeholder](./screenshots/components/atoms/input-placeholder.png) |

### DsEmptyState

| Default (no action) | With action button |
|---|---|
| ![Default](./screenshots/components/atoms/empty-state-default.png) | ![With action](./screenshots/components/atoms/empty-state-action.png) |

---

## Level 2 — Molecules

Compositions of 2–4 atoms that function as a single reusable unit.

### DsStatCard

![StatCard](./screenshots/components/molecules/stat-card-default.png)

### DsSearchBar

![SearchBar](./screenshots/components/molecules/search-bar-default.png)

### DsFormField

| Default | Full width |
|---|---|
| ![Default](./screenshots/components/molecules/form-field-default.png) | ![Full width](./screenshots/components/molecules/form-field-full-width.png) |

---

## Level 3 — Organisms

Complex, self-contained UI sections where real data enters. Every organism handles four states: loading, error, empty, and data.

### DsStatGrid

| Loading | Error |
|---|---|
| ![Loading](./screenshots/components/organisms/stat-grid-loading.png) | ![Error](./screenshots/components/organisms/stat-grid-error.png) |

| Empty | Data |
|---|---|
| ![Empty](./screenshots/components/organisms/stat-grid-empty.png) | ![Data](./screenshots/components/organisms/stat-grid-data.png) |

### DsProjectCardGrid

| Loading | Error |
|---|---|
| ![Loading](./screenshots/components/organisms/card-grid-loading.png) | ![Error](./screenshots/components/organisms/card-grid-error.png) |

| Empty | Data |
|---|---|
| ![Empty](./screenshots/components/organisms/card-grid-empty.png) | ![Data](./screenshots/components/organisms/card-grid-data.png) |

### DsProjectTable

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
