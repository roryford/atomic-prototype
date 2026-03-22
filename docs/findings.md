# Prototype Simulation Findings

Raw findings from all workers. Each entry follows the format:
- **Doc ref:** which doc and section
- **Type:** missing | ambiguous | contradiction | workflow-gap | confirmed-works
- **Detail:** what happened
- **Impact:** what a real team would experience
- **Hypothesis:** H1-H9 if applicable

---

## Was the folder restructure straightforward?

- **Doc ref:** 03-component-architecture.md, folder layout section
- **Type:** confirmed-works
- **Detail:** Restructuring from flat `atoms/`, `molecules/`, `theme/` to `design-system/tokens/`, `design-system/atoms/<name>/`, `design-system/molecules/<name>/` with barrel exports was mechanical. All files moved cleanly, barrel re-exports wired up without issues, and the build passed on first attempt after updating import paths.
- **Impact:** A real team would find this straightforward. The main cost is updating every consumer import path — in this small prototype that was 5 files (app.config, dashboard, list, detail, app.routes). In a larger project with dozens of pages, a codemod or IDE refactoring tool would be strongly recommended.
- **Hypothesis:** H2 (folder conventions are clear enough to execute without ambiguity)

##### Was the selector rename straightforward?

- **Doc ref:** 03-component-architecture.md, naming conventions
- **Type:** confirmed-works
- **Detail:** Renaming selectors (`app-button` → `ds-button`, etc.) and class names (`AppButton` → `DsButton`, etc.) required updating both the component decorator and every template that references the selector. No runtime surprises — Angular's template compiler catches stale selectors at build time, so any missed rename would fail the build immediately.
- **Impact:** Selector renames are safe but tedious. The `ds-` prefix clearly separates design-system atoms/molecules from page-level components that keep the `app-` prefix. A real team should establish the prefix convention before writing any components.
- **Hypothesis:** H5 (naming conventions are unambiguous)

#### New bundle sizes after lazy loading vs POC baseline

**After restructure + lazy-load routes (current):**

| Chunk | Type | Raw Size | Transfer Size |
|-------|------|----------|---------------|
| chunk-X5IL6RFT.js | Initial | 164.59 kB | 47.48 kB |
| chunk-MFIXWTGM.js | Initial | 130.85 kB | 28.74 kB |
| main-BYMX73XU.js | Initial (main) | 115.13 kB | 13.87 kB |
| chunk-XBD6PAOO.js | Initial | 102.68 kB | 26.03 kB |
| styles-Q27L7E7A.css | Initial (styles) | 13.20 kB | 2.40 kB |
| **Initial total** | | **526.45 kB** | **118.52 kB** |
| chunk-5OA5ERID.js | Lazy | 469.52 kB | 81.85 kB |
| chunk-RUVTCH7E.js | Lazy (browser) | 67.75 kB | 17.76 kB |
| chunk-M2FGOHGZ.js | Lazy | 37.31 kB | 8.40 kB |
| chunk-5SN6G4PJ.js | Lazy (dashboard) | 15.05 kB | 4.23 kB |
| chunk-ODHLG6NY.js | Lazy (detail) | 7.28 kB | 2.13 kB |
| chunk-2DKBJFHC.js | Lazy (list) | 6.40 kB | 1.97 kB |

**Key observation:** With `loadComponent` lazy loading, the three page chunks (dashboard 15 kB, detail 7 kB, list 6 kB) are now deferred. The initial bundle dropped compared to the POC baseline where all three pages were statically imported into the route config. PrimeNG's shared chunks dominate the lazy bundle (~470 kB raw) since all three pages pull in PrimeNG table/card/avatar components.

---

## MSW v2 setup and fixture data (H1)

- **Doc ref:** 04-data-layer.md, mock data section
- **Type:** confirmed-works
- **Detail:** MSW v2 installed, `mockServiceWorker.js` generated into `src/` via `npx msw init src`, and registered as an asset in `angular.json`. Created four API handlers (`/api/projects`, `/api/projects/:id`, `/api/stats`, `/api/users`) with simulated delay (200-300ms). Fixture data consolidated from dashboard and list page hardcoded signals into three JSON files (18 projects, 4 stats, 6 users). The `main.ts` bootstrapper conditionally starts the MSW worker in dev mode using `isDevMode()` and dynamic `import()` so the mock code is tree-shaken from production builds.
- **Impact:** Setup was smooth. Two issues surfaced: (1) TypeScript's `noPropertyAccessFromIndexSignature` required bracket notation for MSW `params` access (`params['id']` instead of `params.id`), which is a minor gotcha a team would hit. (2) The Storybook boilerplate stories (`src/stories/*.stories.ts`) were included in `tsconfig.app.json`'s `include` glob but referenced `@storybook/angular` types that aren't available in the app build — fixed by adding `src/**/*.stories.ts` to the `exclude` array. This was a pre-existing issue exposed by running a fresh build, not caused by MSW.
- **Hypothesis:** H1 (docs guide a new team member through mock data setup without ambiguity)

##### Bundle impact of MSW

MSW adds two new lazy chunks to the dev build: `chunk-N64DA4IT.js` (249.63 kB raw, MSW browser runtime) and `chunk-QWDHQACX.js` (67.78 kB raw, MSW browser internals). These are loaded only in dev mode via the dynamic `import('./app/mocks/browser')` guarded by `isDevMode()`, so they are completely absent from production builds. The initial bundle size remains unchanged at ~527 kB.

---

### Storybook 10 + Angular 21 compatibility

- **Doc ref:** 06-tooling-workflows.md, Storybook section
- **Type:** workflow-gap
- **Detail:** Storybook 10.3.1 installed via `npx storybook@latest init` and auto-detected Angular. However, Storybook 10 for Angular **requires** the Angular builder approach (`ng run <project>:storybook`) — calling `storybook dev` directly fails with `SB_FRAMEWORK_ANGULAR_0001 (AngularLegacyBuildOptionsError)`. The init scaffold correctly added `storybook` and `build-storybook` targets to `angular.json` using `@storybook/angular:start-storybook` and `@storybook/angular:build-storybook` builders with `browserTarget` linking to the app's build config. Scripts in `package.json` must use `ng run atomic-prototype:storybook` rather than `storybook dev -p 6006`.
- **Additional issues encountered:**
  1. **CSS imports in preview.ts fail:** Importing `primeicons/primeicons.css` directly in `.storybook/preview.ts` causes webpack module parse failure (`Unexpected character '@'` on `@font-face`). The Angular builder's webpack config adds a `?ngGlobalStyle` query to CSS files from `angular.json`'s `styles` array but does not configure CSS loaders for bare imports in preview.ts. **Fix:** Use `.storybook/preview-head.html` with a CDN `<link>` tag, or rely on the `styles` array in `angular.json` (which already includes `primeicons/primeicons.css`).
  2. **Compodoc integration:** The init added `@compodoc/compodoc` as a devDependency and configured `compodoc: true` in the angular.json storybook targets. Compodoc generates `documentation.json` at project root for auto-docs. It emitted non-critical `Error during /...` messages for some files but completed successfully.
  3. **No story files warning:** After deleting the auto-generated example stories (`src/stories/`), Storybook warns "No story files found" — this is expected until real component stories are written.
- **Impact:** A real team would hit the direct-invocation error immediately if they follow generic Storybook docs instead of Angular-specific setup. The docs should explicitly state that Angular projects must use `ng run` commands. The CSS import limitation means global styles must be loaded either through `angular.json`'s `styles` array or via `preview-head.html`, not through JS imports in preview.ts.
- **Hypothesis:** H3 (Storybook integration requires Angular-specific configuration not covered by generic Storybook docs)

###### Stylelint effectiveness and limitations

- **Doc ref:** 06-tooling-workflows.md, linting section
- **Type:** confirmed-works (with known limitation)
- **Detail:** Installed `stylelint` 17.5.0 and `stylelint-config-standard-scss` 17.0.0. Configured `.stylelintrc.json` with `color-no-hex: true` rule to flag raw hex values in stylesheets. The `stylelint-declaration-use-css-custom-properties` plugin was not available on npm (404), so only the built-in `color-no-hex` rule is used.
- **Lint results:** Running `stylelint 'src/**/*.{scss,css}'` found **1 violation** — `no-empty-source` in `src/app/app.scss` (an empty stylesheet). No hex color violations were found in `.scss`/`.css` files because the prototype's colors are defined in TypeScript (PrimeNG preset) and applied through PrimeNG's theming system, not through SCSS.
- **Known limitation:** Stylelint only processes `.scss` and `.css` files on disk. It does **not** inspect inline `styles:` arrays in Angular component TypeScript decorators. If a developer writes `styles: ['h1 { color: #FF0000; }']` in a component's `@Component()` decorator, Stylelint will not flag it. This is a fundamental limitation — Stylelint is a CSS/SCSS linter, not a TypeScript AST parser. To catch hex values in inline styles, an ESLint rule or custom script would be needed.
- **Impact:** For this PrimeNG-based prototype, Stylelint's `color-no-hex` rule has minimal impact because colors flow through the design token preset (TypeScript), not through stylesheets. The rule becomes more valuable when teams write custom SCSS overrides. The inability to lint inline styles is a gap teams should be aware of.
- **Hypothesis:** H6 (Stylelint enforces token usage in stylesheets but not in inline component styles)

---

## httpResource() import path and API shape (H1, H8)

- **Doc ref:** 04-data-layer.md, service layer section
- **Type:** confirmed-works
- **Detail:** `httpResource` is exported from `@angular/common/http` in Angular 21.2.5. The import `import { httpResource } from '@angular/common/http';` works without issue. It is **not** exported from `@angular/core` or `@angular/core/rxjs-interop`. The function is marked `@experimental 19.2` in the type definitions, indicating it was introduced in Angular 19.2 and remains experimental through Angular 21.
- **API shape:** `httpResource<T>(() => url)` returns an `HttpResourceRef<T>` which extends `WritableResource<T>` and `ResourceRef<T>`. The reactive API exposes: `resource.value()` (signal of the response data), `resource.status()` (signal of `ResourceStatus`), `resource.error()` (signal of `Error | undefined`), `resource.isLoading()` (signal of boolean), `resource.headers()` (signal of response headers), `resource.statusCode()` (signal of HTTP status code), `resource.hasValue()` (type-narrowing guard), `resource.reload()` (triggers re-fetch), and `resource.destroy()`. There is no `.data()` alias — it is `.value()`. Sub-constructors `httpResource.text()`, `httpResource.blob()`, and `httpResource.arrayBuffer()` are available for non-JSON responses.
- **Impact:** The docs should specify `@angular/common/http` as the import path. Any doc referencing `.data()` should be corrected to `.value()`. The experimental status means the API could change in future Angular versions.
- **Hypothesis:** H1 (import path discoverable), H8 (signal-based resource API shape matches documented patterns)

---

## Test runner setup — Angular 21 uses Vitest via @angular/build:unit-test

- **Doc ref:** 06-tooling-workflows.md, testing section
- **Type:** workflow-gap
- **Detail:** The POC was scaffolded with `--skip-tests`, so `angular.json` had no `test` target and no test infrastructure. Angular 21's `@angular/build` package includes a `unit-test` builder (experimental) that defaults to **Vitest** as the test runner (also supports Karma via `"runner": "karma"`). A `tsconfig.spec.json` already existed with `"types": ["vitest/globals"]`, but the `test` architect target was missing from `angular.json` and `vitest` + `jsdom` were not installed.
- **Setup required:**
  1. Added `"test"` target to `angular.json` using `@angular/build:unit-test` builder with `buildTarget: "atomic-prototype:build"` and `tsConfig: "tsconfig.spec.json"`.
  2. Added `tsconfig.spec.json` reference to root `tsconfig.json`.
  3. Installed `vitest` and `jsdom` as devDependencies (`npm install --save-dev vitest jsdom`).
  4. After setup, `npx ng test --no-watch` correctly runs and reports "No tests found" (expected since no `.spec.ts` files exist yet).
- **Impact:** Teams scaffolding with `--skip-tests` will need to manually add the test target and install vitest + jsdom. The builder is experimental and the error messages are clear ("DOM environment required", "no tests found"). The `--watch=false` flag syntax from older Angular/Karma does not work — the correct flag is `--no-watch`.
- **Hypothesis:** Test infrastructure requires manual setup when `--skip-tests` was used at scaffold time
