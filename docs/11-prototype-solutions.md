# Prototype-Stage Solutions

Research findings on tooling and patterns for transitioning from POC to prototype. These solutions address gaps identified during the POC simulation.

→ see 06-maturity-stages § POC to Prototype for what changes at this transition.

---

## Token Pipeline: Manual → Semi-Automated

At prototype stage (50–200 tokens), manual `definePreset()` authoring breaks down. Two paths are available.

### Path A: Open / Free Stack

| Step | Tool | Output |
|------|------|--------|
| 1. Define tokens | Tokens Studio free tier (Figma plugin) | DTCG-format JSON |
| 2. Transform | Style Dictionary v5 + `@tokens-studio/sd-transforms` | Transformed tokens |
| 3. Generate preset | Custom SD format (~50–100 lines) | `definePreset()` TypeScript |

**Key packages:**
- `style-dictionary` (v5.3+) — native DTCG support
- `@tokens-studio/sd-transforms` — bridges Tokens Studio output to Style Dictionary
- Custom format required — no published SD format outputs PrimeNG's `definePreset()` structure

**Workflow:** Designer updates tokens in Figma → exports DTCG JSON via Tokens Studio → developer runs `npm run build:tokens` (Style Dictionary) → reviews generated `preset.ts` → commits.

**Dark mode:** Developer must manually author the `colorScheme.dark` section in the custom SD format or maintain separate light/dark token files. The "hardest mapping" (flat DTCG → nested `colorScheme`) must be handled in the custom format function.

**Cost:** $0 + development time for the custom format (~50–100 lines JS).

### Path B: PrimeOne Stack (Paid)

| Step | Tool | Output |
|------|------|--------|
| 1. Design | PrimeOne UI Kit v4 (native Figma Variables) | Variables with light/dark modes |
| 2. Export | PrimeUI Theme Generator plugin | DTCG JSON + theme code |
| 3. Generate | Theme Designer Extended license | Ready-to-use `definePreset()` preset |
| 4. CI (optional) | `primefaces/figma-to-theme-code-generator` GitHub Action | Automated preset updates on Figma changes |

**Dark mode advantage:** PrimeOne UI Kit v4 defines light and dark values as Figma Variable modes — a single source generates both `colorScheme.light` and `colorScheme.dark` automatically. This eliminates manual dark-mode token mapping and prevents light/dark drift.

**Cost:** PrimeOne UI Kit + Theme Designer Extended license (paid, pricing not publicly listed). Minimal custom code required.

### Which Path to Choose

| Factor | Path A | Path B |
|--------|--------|--------|
| Budget | $0 | Paid license |
| Dark mode | Manual `colorScheme.dark` authoring | Automatic from Figma Variable modes |
| Setup effort | Medium (custom SD format) | Low (turnkey) |
| Token drift risk | Higher (manual sync) | Lower (Figma → CI pipeline) |
| Lock-in | None (open standards) | PrimeFaces ecosystem |
| Best for | Teams comfortable writing build tooling | Teams wanting turnkey with budget |

---

## Bundle Size Optimization

The POC baseline is 1.06MB raw / 206KB gzipped for 3 pages with 7 PrimeNG components. `TableModule` is the primary contributor, pulling ~11 unused transitive dependencies.

### Techniques (ordered by impact)

**1. Route-level lazy loading — `loadComponent()`**
```typescript
// app.routes.ts
{
  path: 'list',
  loadComponent: () => import('./pages/list/list').then(m => m.ListPage),
}
```
Splits each page and its PrimeNG imports into separate chunks. Apply to all routes at prototype stage.

**2. Template-level lazy loading — `@defer`**
```html
@defer (on viewport) {
  <p-table [value]="data()" [rows]="10">...</p-table>
} @placeholder {
  <p-skeleton width="100%" height="20rem" />
}
```
Removes deferred components from the initial bundle entirely. Use for below-fold organisms, dialogs, and heavy components.

Gotcha: referencing a deferred component via `@ViewChild` prevents tree-shaking — it stays in the main bundle.

**3. Bundle analysis — `source-map-explorer`**
```bash
npm install --save-dev source-map-explorer
npx ng build --source-map
npx source-map-explorer dist/your-app/browser/*.js
```
Identifies exactly what contributes to bundle size. Prefer over `webpack-bundle-analyzer` for Angular — source maps produce more accurate attribution.

### Budget Recommendations

| Metric | POC | Prototype | Production |
|--------|-----|-----------|------------|
| Initial bundle (raw) | 1.2MB warn / 1.5MB error | 800KB warn / 1.2MB error | 500KB warn / 800KB error |
| Transfer size (gzip) | 250KB ceiling | 200KB ceiling | 150KB ceiling |

---

## Loading, Empty, and Error States

### `httpResource()` — Angular 21's Built-In Pattern

Replaces manual loading/error state management with signal-based async resources:

```typescript
// In organism or service
users = httpResource<User[]>(() => '/api/users');
```

Built-in states:

| Status | `value()` | Use case |
|--------|-----------|----------|
| `idle` | `undefined` | No valid params yet |
| `loading` | `undefined` | First load |
| `reloading` | previous value | Refresh via `.reload()` |
| `resolved` | data | Success |
| `error` | `undefined` | Request failed |

Template pattern:
```html
@if (users.isLoading()) {
  <p-skeleton width="100%" height="3rem" />
} @else if (users.error()) {
  <p-message severity="error" text="Failed to load data" />
} @else if (users.hasValue() && users.value().length === 0) {
  <app-empty-state message="No users found" />
} @else if (users.hasValue()) {
  <p-table [value]="users.value()" />
}
```

**Key rules:**
- Guard `value()` reads with `hasValue()` — reading in error state throws
- Use `.reload()` for retry/refresh (preserves existing data during reload)
- `httpResource()` is for reads only — use `HttpClient` directly for mutations
- Still experimental — wrap behind service methods to insulate from API changes
- Supports Zod validation via `parse` option

### PrimeNG Components for States

| State | Component | Usage |
|-------|-----------|-------|
| Loading | `p-skeleton` | Shape to match organism layout (rectangle, circle) |
| Loading (overlay) | `p-blockUI` + `p-progressSpinner` | Show stale data behind loading overlay during reloads |
| Error | `p-message` | `severity="error"` with retry action |
| Empty | Custom atom | Icon + message + action button (PrimeNG has no built-in empty state) |

### API Mocking with MSW v2

Mock Service Worker intercepts at the network level — completely transparent to `httpResource()` and Angular's `HttpClient` interceptors.

Setup:
```bash
npm install msw --save-dev
npx msw init src
```

Add `src/mockServiceWorker.js` to `angular.json` assets. Create handlers:
```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Sarah Chen', role: 'Engineer' },
      { id: 2, name: 'Alex Rivera', role: 'Designer' },
    ]);
  }),
];
```

Start conditionally in `main.ts`:
```typescript
async function bootstrap() {
  if (isDevMode()) {
    const { worker } = await import('./mocks/browser');
    await worker.start();
  }
  bootstrapApplication(App, appConfig);
}
```

No changes needed to services or `httpResource()` calls.

### Error Handling

Angular 21 has no component-level error boundaries (feature request open since 2017). The practical approach:

| Layer | Mechanism | Scope |
|-------|-----------|-------|
| Per-resource | `httpResource().error()` signal | Template-level error display |
| Per-organism | `catchError` in Observable pipelines | Graceful degradation |
| Global | Override `ErrorHandler` service | Catch-all logging |

---

## Component Development and Visual Testing

### Storybook 10 for Angular 21

Setup:
```bash
npx storybook@latest init
```

PrimeNG-specific configuration in `.storybook/preview.ts`:
```typescript
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import CustomPreset from '../src/app/theme/preset';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: CustomPreset } }),
      ],
    }),
  ],
};
```

Also add PrimeNG/PrimeIcons CSS to Storybook's styles configuration.

No viable Angular alternatives to Storybook exist — Histoire and Ladle are React/Vue only.

### Visual Regression Testing

**Chromatic** (by Storybook team) — simplest for small teams:
- Auto-snapshots every story
- **Modes** feature tests same story across light/dark themes and viewports
- Free tier: 5,000 snapshots/month

**Self-hosted alternatives:**
- Playwright `toHaveScreenshot()` — built-in visual comparison, two test variants toggling theme class
- BackstopJS — open source screenshot diffing

### Linting Hardcoded Colors

Prevent the #1 dark mode gotcha (hardcoded hex values) at the linter level:

`.stylelintrc.json`:
```json
{
  "plugins": ["stylelint-declaration-use-css-custom-properties"],
  "rules": {
    "color-no-hex": true,
    "mavrin/stylelint-declaration-use-css-custom-properties": {
      "cssDefinitions": ["color"],
      "ignoreValues": ["transparent", "inherit", "currentColor"]
    }
  }
}
```

- `color-no-hex` flags all hex values (built-in Stylelint rule)
- `stylelint-declaration-use-css-custom-properties` enforces `var(--*)` for color properties

Neither auto-suggests the correct `--p-*` token — inspect `@primeng/themes/aura` source or browser DevTools for the mapping.

### Test Runner Setup

**Test runner setup note.** If the project was scaffolded with `--skip-tests`, there is no `test` target in `angular.json`. Add the target manually using `@angular/build:unit-test` (Vitest-based). Install `vitest` and `jsdom` as dev dependencies. Use `--no-watch` flag (not `--watch=false` — Angular 21 changed the syntax). Angular 21's default test runner completes 36 tests in ~2 seconds.

### PrimeNG Interaction Testing Limitation

**PrimeNG interaction testing limitation.** PrimeNG's `(onClick)` output on `p-button` does not fire from native DOM click events in jsdom-based test runners. Unit tests should verify output wiring directly. For full interaction testing, use Storybook play functions (`@storybook/test` utilities: `within`, `userEvent`) or Playwright.

---

## Cross-References

- For what changes at POC → Prototype, see [06-maturity-stages § POC to Prototype](./06-maturity-stages.md)
- For token tier system and `definePreset()`, see [03-token-pipeline](./03-token-pipeline.md)
- For QA per atomic level at prototype, see [04-qa-per-atomic-level](./04-qa-per-atomic-level.md)
- For Angular 21 features and signal patterns, see [09-angular-direction](./09-angular-direction.md)
- For practical tips from the POC simulation, see [10-implementation-tips](./10-implementation-tips.md)
