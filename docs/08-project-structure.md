# 08 - Project Structure

> **Key question:** What does the project directory look like at each maturity level?

This is a single Angular project that evolves in place. There is no migration between repositories, no monorepo split, and no Nx workspace unless a second application needs to consume the design system. A team of 2-4 does not need the overhead.

Each section below shows the directory tree at a given maturity level, what is intentionally absent, and configuration examples you can copy-paste.

> **Cross-reference:** For a full description of _what gets built_ at each stage and the exit criteria for graduating to the next one, see [06-maturity-stages.md](./06-maturity-stages.md).

---

## 1. POC Structure

The goal is speed-to-screen. You prove a PrimeNG preset can approximate the Figma comp well enough to justify further investment. Everything lives in a flat structure with no abstractions beyond what the CLI scaffolds.

```
src/app/
├── theme/
│   └── preset.ts                    # Rough definePreset() with eyeballed Figma values
├── pages/
│   ├── dashboard/
│   │   └── dashboard.ts   # Inline template and styles
│   ├── detail/
│   │   └── detail.ts
│   └── list/
│       └── list.ts
├── app.routes.ts                    # Flat route array, no lazy loading
├── app.config.ts                    # providePrimeNG + HttpClient
└── app.ts
```

> **Tip:** If the team wants to practice atomic decomposition during the POC (recommended), add `atoms/` and `molecules/` folders even at this stage. The decomposition exercise surfaces type-narrowing and wrapper-depth decisions that are better resolved early.

### What is intentionally missing

| Absent | Reason |
|--------|--------|
| `design-system/` folder | No reuse targets yet -- everything is page-scoped |
| Storybook | No isolated component development needed for a throwaway spike |
| Unit / E2E tests | Speed matters more than regression safety at this stage |
| CI pipeline | Nothing to gate -- the POC never ships to users |
| Services / data layer | Pages use hard-coded JSON or direct `fetch` calls |
| Design tokens pipeline | Colors and spacing are manually eyeballed from Figma |

### `app.config.ts` -- PrimeNG bootstrap

```typescript
// Note: @angular/animations must be installed separately: npm install @angular/animations
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { CustomPreset } from './theme/preset';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
  ],
};
```

### `preset.ts` -- eyeballed Figma values

```typescript
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const CustomPreset = definePreset(Aura, {
  primitive: {
    blue: {
      500: '#2563EB',   // sampled from Figma primary swatch
    },
    slate: {
      100: '#F1F5F9',
      700: '#334155',
      900: '#0F172A',
    },
  },
  semantic: {
    primary: {
      50:  '{blue.50}',
      500: '{blue.500}',
      900: '{blue.900}',
    },
    colorScheme: {
      light: {
        surface: {
          0:   '#FFFFFF',
          100: '{slate.100}',
          900: '{slate.900}',
        },
      },
    },
  },
});
```

At this stage every value is hand-picked from Figma using a color-picker. That is fine -- the preset exists only to prove the theme _can_ work, not to be pixel-perfect.

---

## 2. Prototype Structure

The prototype introduces Atomic Design folders, a real token pipeline, and (optionally) Storybook and MSW. It is the same Angular project as the POC -- you add folders, not repositories.

```
src/app/
├── design-system/
│   ├── tokens/
│   │   ├── primitives.json              # DTCG format: raw palette
│   │   ├── semantic.json                # DTCG format: intent-based aliases
│   │   ├── generated/
│   │   │   ├── _primitives.scss         # Style Dictionary output
│   │   │   ├── _semantic.scss
│   │   │   └── preset.ts               # Generated definePreset()
│   │   └── index.ts                     # Barrel export for generated outputs
│   ├── atoms/
│   │   ├── button/
│   │   │   ├── button.ts                # Inline template (thin wrapper)
│   │   │   ├── button.spec.ts
│   │   │   └── button.stories.ts
│   │   ├── input/
│   │   │   ├── input.ts                 # Inline template (thin wrapper)
│   │   │   ├── input.spec.ts
│   │   │   └── input.stories.ts
│   │   └── index.ts                     # Barrel export
│   ├── molecules/
│   │   ├── search-bar/
│   │   │   ├── search-bar.ts
│   │   │   ├── search-bar.html
│   │   │   ├── search-bar.scss
│   │   │   ├── search-bar.spec.ts
│   │   │   └── search-bar.stories.ts
│   │   └── index.ts
│   ├── organisms/
│   │   ├── data-table/
│   │   │   ├── data-table.ts
│   │   │   ├── data-table.html
│   │   │   ├── data-table.scss
│   │   │   ├── data-table.spec.ts
│   │   │   └── data-table.stories.ts
│   │   └── index.ts
│   └── templates/                       # Only if layout patterns emerge
│       ├── sidebar-layout/
│       │   ├── sidebar-layout.ts
│       │   ├── sidebar-layout.html
│       │   ├── sidebar-layout.scss
│       │   ├── sidebar-layout.spec.ts
│       │   └── sidebar-layout.stories.ts
│       └── index.ts
├── pages/
│   ├── dashboard/
│   ├── detail/
│   └── list/
├── mocks/
│   ├── browser.ts                         # MSW worker setup
│   ├── handlers.ts                        # API endpoint handlers
│   └── fixtures/
│       ├── projects.json                  # Realistic test data
│       └── users.json
├── models/
│   └── index.ts                           # Shared interfaces (Project, User, etc.)
├── services/
│   ├── user.service.ts
│   └── project.service.ts
├── app.routes.ts
├── app.config.ts
└── app.ts
```

> **Shared models early.** Define canonical data interfaces in `models/` early. The POC simulation found the same interface defined differently in multiple pages — a shared model prevents this drift.

Optional top-level additions at prototype stage:

```
.storybook/
├── main.ts                              # Framework config
└── preview.ts                           # PrimeNG providers, theme
```

```
.stylelintrc.json                        # Enforces color-no-hex rule
```

### Component file convention

The rule is simple: **atoms with a one-line template use inline template and styles. Everything else gets separate files.**

Atoms are thin PrimeNG wrappers. Their template is often a single element with bound inputs:

```typescript
// atoms/button/button.ts
import { Button } from 'primeng/button';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [Button],
  template: `<p-button [label]="label" [severity]="severity" [outlined]="outlined" />`,
})
export class DsButton {
  label = input<string>();
  severity = input<string>('primary');
  outlined = input<boolean>(false);
}
```

> **Import note:** Use standalone imports (`import { Button } from 'primeng/button'`) rather than module imports. Use `TableModule` only for organism primitives that need template directives (`pTemplate`, `pSortableColumn`).

Molecules and above always use separate `.html` and `.scss` files because their templates are non-trivial.

### How components import each other

Imports use simple relative paths. No path aliases are needed within a single project:

```typescript
// pages/dashboard/dashboard.ts
import { Component } from '@angular/core';
import { DataTable } from '../../design-system/organisms/data-table/data-table';
import { SidebarLayout } from '../../design-system/templates/sidebar-layout/sidebar-layout';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarLayout, DataTable],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
```

Barrel exports (`index.ts` at each atomic level) are optional but helpful. If you use them, the import simplifies:

```typescript
import { DataTable } from '../../design-system/organisms';
```

### Storybook setup (if adopted)

The `.storybook/preview.ts` file provides PrimeNG globally so stories do not need to configure it individually:

```typescript
// .storybook/preview.ts
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { CustomPreset } from '../src/app/design-system/tokens/generated/preset';

export const decorators = [
  applicationConfig({
    providers: [
      provideAnimationsAsync(),
      providePrimeNG({
        theme: { preset: CustomPreset },
      }),
    ],
  }),
];
```

Stories use the `title` field to group by atomic level:

```typescript
// button.stories.ts
const meta: Meta<DsButton> = {
  title: 'Design System/Atoms/Button',
  component: DsButton,
};
export default meta;
```

---

## 3. Production Structure

Same project, evolved. The main additions are a `core/` folder for cross-cutting concerns, lazy-loaded routes, and a CI pipeline.

```
src/app/
├── design-system/
│   ├── tokens/
│   │   ├── primitives.json
│   │   ├── semantic.json
│   │   ├── generated/
│   │   │   ├── _primitives.scss
│   │   │   ├── _semantic.scss
│   │   │   └── preset.ts
│   │   └── index.ts
│   ├── atoms/
│   │   ├── button/
│   │   ├── input/
│   │   ├── badge/
│   │   └── index.ts
│   ├── molecules/
│   │   ├── search-bar/
│   │   ├── form-field/
│   │   ├── stat-card/
│   │   └── index.ts
│   ├── organisms/
│   │   ├── data-table/
│   │   ├── sidebar-nav/
│   │   └── index.ts
│   └── templates/
│       ├── sidebar-layout/
│       └── index.ts
├── pages/
│   ├── dashboard/
│   │   ├── dashboard.ts
│   │   ├── dashboard.html
│   │   └── dashboard.scss
│   ├── detail/
│   └── list/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   └── error-handling/
│       └── global-error-handler.ts
├── services/
│   ├── user.service.ts
│   └── project.service.ts
├── app.routes.ts                        # loadComponent / loadChildren
├── app.config.ts                        # Same providers + interceptors
└── app.ts
```

### Lazy-loaded route example

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./pages/list/list').then(m => m.List),
  },
  {
    path: 'detail/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/detail/detail').then(m => m.Detail),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/admin/admin.routes').then(m => m.adminRoutes),
  },
];
```

Each page is loaded on demand. The initial bundle contains only the shell, PrimeNG core, and the design system components used in the shell layout. Feature pages are fetched when navigated to.

### CI pipeline: one workflow file

There is one CI workflow, not three. Add complexity only when pain justifies it.

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run build

  e2e:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run e2e
```

On every PR: lint, test, build. On merge to main: the same checks plus Playwright E2E. One file, two jobs. If visual regression testing (Chromatic) or token sync automation become necessary, add them as steps in this same workflow or as a second workflow at that point -- not before.

### When to consider Nx

If a second application needs to consume this design system, consider extracting `design-system/` into an Nx monorepo with publishable libraries. Until then, a single Angular project is simpler for a team of 2-4. The overhead of Nx (workspace configuration, project.json per library, dependency graph management) is not justified by a single consuming application.

---

## Dependency Discipline

Without Nx there are no lint rules enforcing module boundaries. Instead, the team enforces the dependency direction through PR review and a simple convention:

| Layer | May import from |
|-------|----------------|
| **Atoms** | Tokens only |
| **Molecules** | Atoms + Tokens |
| **Organisms** | Anything in `design-system/` |
| **Templates** | Anything in `design-system/` |
| **Pages** | Everything (design system, services, core) |
| **Core** | Nothing in `design-system/` or `pages/` |

The rule of thumb: **if you find an atom importing a molecule, it is probably classified wrong.** Reclassify the component rather than bending the dependency direction.

During PR review, check the import paths at the top of each changed file. A molecule importing from `../organisms/` is a red flag. This takes seconds to verify and catches the vast majority of violations.

---

## File Naming

| Item | Convention | Example |
|------|-----------|---------|
| Component folder | kebab-case | `search-bar/` |
| Component class | PascalCase | `SearchBar` |
| Component selector | prefixed kebab-case | `ds-search-bar` (use `app-` during POC, switch to `ds-` at prototype when the design system folder is introduced) |
| Component file | `.ts` | `search-bar.ts` |
| Test file | `.spec.ts` | `search-bar.spec.ts` |
| Story file | `.stories.ts` | `search-bar.stories.ts` |
| Service | `.service.ts` | `user.service.ts` |
| Guard | `.guard.ts` | `auth.guard.ts` |
| Interceptor | `.interceptor.ts` | `error.interceptor.ts` |
| Barrel export | `index.ts` | `index.ts` |

> **Angular 21 note:** Angular 21 uses the 2025 naming convention by default. The `.component` suffix is no longer generated. File: `button.ts` (not `button.component.ts`). Class: `Button` (not `ButtonComponent`). Test: `button.spec.ts`. Story: `button.stories.ts`.

All names follow Angular 21 CLI defaults. Barrel exports (`index.ts`) at each atomic level are optional but simplify imports when the number of components grows.

### Scaffolding new components

There are no custom generators. To create a new atom:

1. Copy an existing atom folder (e.g., `button/`) and rename files.
2. Find-and-replace the component name.
3. Add the export to the level's `index.ts` barrel (if using barrels).

Alternatively, use the Angular CLI:

```bash
ng generate component design-system/atoms/tooltip --inline-template --inline-style --skip-tests
```

Then add the `.spec.ts` and `.stories.ts` files manually. For molecules and above, drop the `--inline-template --inline-style` flags.

---

> **Next step:** For what gets built at each maturity level and the criteria for graduating between them, see [06-maturity-stages.md](./06-maturity-stages.md).
