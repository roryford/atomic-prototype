# Implementation Tips

> **When to read:** When you are about to write your first component, or when you hit a specific gotcha. Skim the headings, read what applies.

Practical guidance from the POC and prototype simulations. These tips supplement the process docs -- they capture what the docs don't say.

---

## Before Writing Code

- **Settle file naming early.** Angular 21 uses 2025 naming (`button.ts`, class `Button`) by default. The team must decide: adopt 2025 convention, or manually use legacy naming (`.component.ts`, `ButtonComponent`). Mixed naming in one project causes confusion. Pick one and stick with it.

- **Spike `definePreset()` early in the POC.** The token path discovery -- figuring out that button colors live at `components.button.root.primary.background` -- is the hardest part of theming. Don't save this for the end of the POC. Read `@primeuix/themes/types` to understand the nesting.

- **Agree on a single set of breakpoints.** The responsive approach (reflow vs restructure) should be decided early. For canonical breakpoints, see [04-parallel-development](./04-parallel-development.md).

---

## Theming

- **Always use CSS custom properties for colors** — see [05-token-pipeline § Dark Mode](./05-token-pipeline.md#4-dark-mode) for the full dark mode guide (toggle strategy, colorScheme nesting, Stylelint gap, production gaps). Hardcoded hex is the #1 reason dark mode breaks.

- **`definePreset()` covers ~80% of design needs.** For the remaining ~20%:
  1. Try the `pt` (passthrough) API first -- it's type-safe and survives upgrades
  2. Use component-scoped CSS second
  3. `::ng-deep` or `ViewEncapsulation.None` only as a last resort
  No `!important` should be needed with PrimeNG 21.

- **`pt` API keys differ from `definePreset()` token names.** DataTable uses `headerCell` in definePreset but `thead` in the pt API. Always check PrimeNG's TypeScript types for correct pt keys -- don't assume they match.

- **Font family has no token slot.** Set it via global CSS (`body { font-family: Inter, sans-serif; }`), not through `definePreset()`. Same for button default font-size -- only `sm`/`lg` size variants have tokens.

> **See it in code:** `src/app/design-system/tokens/preset.ts` contains the project's `definePreset()` configuration.

---

## Atoms and Wrappers

- **Type your severity inputs.** PrimeNG uses union types for severity: `'success' | 'info' | 'warn' | 'danger' | ...`. If your atom wrapper uses `input<string>()`, it will fail type-checking when binding to the inner PrimeNG component. Declare the union locally or import it from PrimeNG.

- **Start with minimal inputs.** An atom wrapper should expose only the inputs the design system currently needs -- not every input PrimeNG offers. Add more when a real use case demands it, not preemptively.

- **Use standalone imports for atoms.** `import { Button } from 'primeng/button'` is cleaner than module imports. Use `TableModule` only for organism primitives that need template directives (`pTemplate`, `pSortableColumn`).

---

## Token Pipeline at Prototype

At prototype stage (50-200 tokens), manual `definePreset()` authoring breaks down. Two paths are available.

### Path A: Open / Free Stack

| Step | Tool | Output |
|------|------|--------|
| 1. Define tokens | Tokens Studio free tier (Figma plugin) | DTCG-format JSON |
| 2. Transform | Style Dictionary v5 + `@tokens-studio/sd-transforms` | Transformed tokens |
| 3. Generate preset | Custom SD format (~50-100 lines) | `definePreset()` TypeScript |

**Key packages:**
- `style-dictionary` (v5.3+) -- native DTCG support
- `@tokens-studio/sd-transforms` -- bridges Tokens Studio output to Style Dictionary
- Custom format required -- no published SD format outputs PrimeNG's `definePreset()` structure

**Workflow:** Designer updates tokens in Figma -> exports DTCG JSON via Tokens Studio -> developer runs `npm run build:tokens` (Style Dictionary) -> reviews generated `preset.ts` -> commits.

**Dark mode:** Developer must manually author the `colorScheme.dark` section in the custom SD format or maintain separate light/dark token files. The "hardest mapping" (flat DTCG -> nested `colorScheme`) must be handled in the custom format function.

**Cost:** $0 + development time for the custom format (~50-100 lines JS).

### Path B: PrimeOne Stack (Paid)

| Step | Tool | Output |
|------|------|--------|
| 1. Design | PrimeOne UI Kit v4 (native Figma Variables) | Variables with light/dark modes |
| 2. Export | PrimeUI Theme Generator plugin | DTCG JSON + theme code |
| 3. Generate | Theme Designer Extended license | Ready-to-use `definePreset()` preset |
| 4. CI (optional) | `primefaces/figma-to-theme-code-generator` GitHub Action | Automated preset updates on Figma changes |

**Dark mode advantage:** PrimeOne UI Kit v4 defines light and dark values as Figma Variable modes -- a single source generates both `colorScheme.light` and `colorScheme.dark` automatically. This eliminates manual dark-mode token mapping and prevents light/dark drift.

**Cost:** PrimeOne UI Kit + Theme Designer Extended license (paid, pricing not publicly listed). Minimal custom code required.

### Which Path to Choose

| Factor | Path A | Path B |
|--------|--------|--------|
| Budget | $0 | Paid license |
| Dark mode | Manual `colorScheme.dark` authoring | Automatic from Figma Variable modes |
| Setup effort | Medium (custom SD format) | Low (turnkey) |
| Token drift risk | Higher (manual sync) | Lower (Figma -> CI pipeline) |
| Lock-in | None (open standards) | PrimeFaces ecosystem |
| Best for | Teams comfortable writing build tooling | Teams wanting turnkey with budget |

> **See it in code:** For an example token pipeline configuration, see the `token-pipeline/` directory in the project root.

---

## Bundle Size

`TableModule` is heavy -- it pulls ~11 transitive PrimeNG dependencies (dialog, datepicker, tree, treetable) even if you only use basic table features. A 3-page POC with 7 PrimeNG components produces a 1.06MB initial bundle (206KB gzipped).

### Techniques (ordered by impact)

**1. Route-level lazy loading -- `loadComponent()`**
```typescript
// app.routes.ts
{
  path: 'list',
  loadComponent: () => import('./pages/list/list').then(m => m.ListPage),
}
```
Splits each page and its PrimeNG imports into separate chunks. Apply to all routes at prototype stage.

**2. Template-level lazy loading -- `@defer`**
```html
@defer (on viewport) {
  <p-table [value]="data()" [rows]="10">...</p-table>
} @placeholder {
  <p-skeleton width="100%" height="20rem" />
}
```
Removes deferred components from the initial bundle entirely. Use for below-fold organisms, dialogs, and heavy components.

Gotcha: referencing a deferred component via `@ViewChild` prevents tree-shaking -- it stays in the main bundle.

**3. Bundle analysis -- `source-map-explorer`**
```bash
npm install --save-dev source-map-explorer
npx ng build --source-map
npx source-map-explorer dist/your-app/browser/*.js
```
Identifies exactly what contributes to bundle size. Prefer over `webpack-bundle-analyzer` for Angular -- source maps produce more accurate attribution.

### Budget Recommendations

| Metric | POC | Prototype | Production |
|--------|-----|-----------|------------|
| Initial bundle (raw) | 1.2MB warn / 1.5MB error | 800KB warn / 1.2MB error | 500KB warn / 800KB error |
| Transfer size (gzip) | 250KB ceiling | 200KB ceiling | 150KB ceiling |

---

## Loading, Empty, and Error States

### `httpResource()` -- Angular 21's Built-In Pattern

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

Template pattern (the 4-state organism):
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
- Guard `value()` reads with `hasValue()` -- reading in error state throws
- Use `.reload()` for retry/refresh (preserves existing data during reload)
- `httpResource()` is for reads only -- use `HttpClient` directly for mutations
- Still experimental -- wrap behind service methods to insulate from API changes
- Supports Zod validation via `parse` option
- **Distinguish search-no-results from empty.** Empty = no data exists ("No projects found" + optional create action). Search-no-results = data exists but filter excludes everything ("No results for [query]" + "Clear search" action). These are different states with different UI.

### PrimeNG Components for States

| State | Component | Usage |
|-------|-----------|-------|
| Loading | `p-skeleton` | Shape to match organism layout (rectangle, circle) |
| Loading (overlay) | `p-blockUI` + `p-progressSpinner` | Show stale data behind loading overlay during reloads |
| Error | `p-message` | `severity="error"` with retry action |
| Empty | Custom atom | Icon + message + action button (PrimeNG has no built-in empty state) |

### API Mocking with MSW v2

Mock Service Worker intercepts at the network level -- completely transparent to `httpResource()` and Angular's `HttpClient` interceptors.

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

### Error Handling Strategy

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

No viable Angular alternatives to Storybook exist -- Histoire and Ladle are React/Vue only.

**Gotchas:**

- **Must use `ng run`, not `storybook dev`.** Direct invocation fails with `SB_FRAMEWORK_ANGULAR_0001`. Use `ng run atomic-prototype:storybook` (or `npm run storybook` which wraps it).
- **CSS imports in `preview.ts` fail.** Importing `primeicons/primeicons.css` directly causes a webpack parse error (`Unexpected character '@'` on `@font-face`). Load global styles through `angular.json`'s `styles` array or via a CDN `<link>` in `.storybook/preview-head.html` instead.

For tool evaluation and alternatives, see [06-tooling-landscape](./06-tooling-landscape.md).

### Visual Regression Testing

**Chromatic** (by Storybook team) -- simplest for small teams:
- Auto-snapshots every story
- **Modes** feature tests same story across light/dark themes and viewports
- Free tier: 5,000 snapshots/month

**Self-hosted alternatives:**
- Playwright `toHaveScreenshot()` -- built-in visual comparison, two test variants toggling theme class
- BackstopJS -- open source screenshot diffing

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

Neither auto-suggests the correct `--p-*` token -- inspect `@primeng/themes/aura` source or browser DevTools for the mapping.

For the full linting tool landscape, see [06-tooling-landscape](./06-tooling-landscape.md).

### Test Runner Setup

If the project was scaffolded with `--skip-tests`, there is no `test` target in `angular.json`. Add the target manually using `@angular/build:unit-test` (Vitest-based). Install `vitest` and `jsdom` as dev dependencies. Use `--no-watch` flag (not `--watch=false` -- Angular 21 changed the syntax). Angular 21's default test runner completes 36 tests in ~2 seconds.

### PrimeNG Interaction Testing Limitation

PrimeNG's `(onClick)` output on `p-button` does not fire from native DOM click events in jsdom-based test runners. Unit tests should verify output wiring directly. For full interaction testing, use Storybook play functions (`@storybook/test` utilities: `within`, `userEvent`) or Playwright.

---

## Angular 21 Specifics

- **Zoneless is default.** Don't add `provideZonelessChangeDetection()` -- it's unnecessary and may warn. Do add `provideBrowserGlobalErrorListeners()` (new in Angular 21).

- **Install `@angular/animations` separately.** PrimeNG needs `provideAnimationsAsync()`, which requires `@angular/animations`. It's not included in Angular 21's default scaffold: `npm install @angular/animations`.

- **Signals are first-class.** Use `input()`, `output()`, `model()` for atom APIs. Use `computed()` in molecules. Use `signal()` for hardcoded data in POC pages. Angular 21 generates component properties as signals by default.

---

## Process Tips

- **Design and dev start together, not sequentially.** The designer shares token values (even rough ones) and the developer starts building the same week. Don't wait for a "final" design -- iterate together.

- **Maturity is per-component, not per-project.** Your atoms can be at production quality while your pages are still at POC. Build from the bottom up: atoms -> molecules -> organisms -> templates -> pages. See [02-maturity-stages](./02-maturity-stages.md) for level definitions.

- **The cascade rule works.** Each level imports only from the level below. This feels strict at first but prevents circular dependencies and makes components independently testable. Trust it.

- **Keep a "questions for design" list.** While building, the developer will discover missing states (empty table, error, loading). Don't block on these -- build with placeholder states and flag them for the designer. Conversation, not tickets.

- **Evaluate token pipeline tooling early in prototype.** Manual `definePreset()` works for 10-20 tokens but breaks at 50+. See the Token Pipeline section above for the two paths.

- **Atoms and molecules are technical PBIs. Organisms and pages need BA involvement.** Below the organism boundary is "dumb UI" where the component API is the requirement. Above it is "smart features" where states, journeys, and error recovery matter. A BA (or someone in that role) should own acceptance criteria for organisms and pages. See [08-pbi-and-ba-guide](./08-pbi-and-ba-guide.md) for PBI templates.

- **Don't write "handle loading and error" without specifying visuals.** An organism PBI must reference the design spec for what loading skeletons look like, what the error message says, and what the empty state shows. If the design spec doesn't cover these, flag it for the designer before starting development.

---

## Cross-References

- For maturity stage definitions and transitions, see [02-maturity-stages](./02-maturity-stages.md).
- For project structure and file conventions, see [03-project-structure](./03-project-structure.md).
- For the parallel development model and breakpoints, see [04-parallel-development](./04-parallel-development.md).
- For token tier system and `definePreset()`, see [05-token-pipeline](./05-token-pipeline.md).
- For QA per atomic level at prototype, see [07-qa-per-atomic-level](./07-qa-per-atomic-level.md).
- For Angular 21 features and signal patterns, see [09-angular-direction](./09-angular-direction.md).
- For risk tracking, see [10-derisking](./10-derisking.md).
