# Atomic Design Prototype Simulation Report

## 1. Executive Summary

This report covers the prototype phase of an Angular 21 atomic design simulation. The prototype extended the proof-of-concept (3 pages, 4 atoms, 1 molecule) into a fully wired application with mock data, testing, Storybook stories, and lazy loading.

**What was simulated:**

- Restructuring a flat component layout into a `design-system/` folder hierarchy with barrel exports
- Renaming selectors from `app-` to `ds-` prefix for design-system components
- Adding 2 new molecules (DsSearchBar, DsFormField), 1 new atom (DsEmptyState), and 3 organisms (DsStatGrid, DsProjectCardGrid, DsProjectTable)
- Wiring MSW v2 for mock API data (4 endpoints, fixture data for 18 projects, 4 stats, 6 users)
- Integrating Storybook 10 with Angular 21
- Setting up Vitest as the test runner via `@angular/build:unit-test`
- Implementing lazy loading for all three page routes
- Enforcing design token usage via Stylelint `color-no-hex`
- Remediating 11 hardcoded hex values in inline styles
- Writing 36 unit tests across 13 spec files
- Creating 10 Storybook story files

**What was not simulated:**

- E2E testing (Playwright)
- Visual regression testing (Chromatic)
- CI/CD pipeline integration
- Real API integration or authentication
- Designer handoff review

**Key stats:**

| Metric | Count |
|--------|-------|
| Atoms | 4 (DsButton, DsTag, DsInput, DsEmptyState) |
| Molecules | 3 (DsStatCard, DsSearchBar, DsFormField) |
| Organisms | 3 (DsStatGrid, DsProjectCardGrid, DsProjectTable) |
| Pages | 3 (Dashboard, List, Detail) |
| Services | 2 (ProjectService, UserService) |
| Unit tests | 36 across 13 spec files |
| Story files | 10 |
| MSW endpoints | 4 |
| Findings logged | 8 |
| Hypotheses tested | 9 (6 confirmed, 2 confirmed with caveats, 1 partial) |

**Overall assessment:** The atomic design process documentation is sufficient to guide a small team through a prototype build. All three user journeys are completable. The primary gaps are around inline style linting (Stylelint cannot inspect TypeScript files) and Storybook invocation (must use `ng run`, not `storybook dev`). Bundle size improved significantly with lazy loading (49% raw reduction). The experimental status of `httpResource()` is the main technical risk for production.

---

## 2. User Journey Results

### Journey 1: Browse Projects — COMPLETABLE

- Dashboard loads with skeleton states for ~300ms (MSW simulated delay), then populates 4 stat cards and 3 project cards.
- Clicking a project card navigates to `/detail/:id` showing project name, owner, status, and description.
- "Back to List" button navigates to `/list`.
- **Evidence:** Dashboard page wires `DsStatGrid` and `DsProjectCardGrid` organisms with `httpResource()` signals from `ProjectService`. Navigation uses Angular Router `routerLink` directives. Page smoke tests pass.

### Journey 2: Search and Filter — COMPLETABLE

- List page loads with table skeleton, then populates with 18 projects from MSW fixture data.
- Typing "Alpha" in the search bar filters the table to matching rows.
- Clicking "View" on a row navigates to `/detail/:id`.
- Clearing the search restores all 18 rows.
- **Evidence:** `DsProjectTable` organism handles search filtering internally. `DsSearchBar` molecule emits `searched` events. 5 table-specific tests cover loading, error, empty, data, and filtering states.

### Journey 3: Handle Errors — COMPLETABLE

- Navigating to `/detail/999` shows "Project not found" error state.
- Stats and projects load independently on the dashboard — if projects fail but stats succeed, stats render normally while the projects section shows an error with a retry button.
- Navigating away from error states works via router navigation.
- **Evidence:** Error states are wired through `httpResource().error()` signal. Each organism (StatGrid, ProjectCardGrid, ProjectTable) independently handles its own error state with retry button emission.

---

## 3. Hypothesis Results

### Technical Hypotheses

#### H1: MSW + httpResource() work seamlessly — YES

MSW v2 intercepts `fetch()` calls transparently. `httpResource` (from `@angular/common/http`, marked `@experimental 19.2`) creates signal-based resources that expose `.value()`, `.status()`, `.error()`, and `.isLoading()`. MSW's service worker is conditionally loaded via `isDevMode()` + dynamic `import()`, so mock code is tree-shaken from production builds. Minor gotcha: TypeScript's `noPropertyAccessFromIndexSignature` requires bracket notation for MSW params (`params['id']`).

#### H2: design-system/ folder structure works well — YES

Restructuring from flat `atoms/`, `molecules/` to `design-system/atoms/<name>/`, `design-system/molecules/<name>/` with barrel exports (`index.ts`) was mechanical. Build passed on first attempt after updating 5 consumer import paths. Barrel re-exports simplify consumer imports to `import { DsButton, DsTag } from '../design-system/atoms'`.

#### H3: Storybook 10 + Angular 21 compatibility — YES, with caveats

Storybook 10.3.1 works with Angular 21 but requires the Angular builder approach (`ng run <project>:storybook`). Calling `storybook dev` directly fails with `SB_FRAMEWORK_ANGULAR_0001`. Additionally, importing CSS files directly in `.storybook/preview.ts` fails — PrimeIcons must be loaded via a CDN `<link>` tag in `preview-head.html` or through `angular.json`'s `styles` array.

#### H4: Lazy loading has significant bundle impact — YES

Initial bundle dropped from 1.06 MB to 540.54 KB raw (49% reduction) and from 206 KB to 122.17 KB gzipped (41% reduction). The three page chunks are deferred: Dashboard (15.33 KB), Detail (9.97 KB), List (465.93 KB). The list chunk is heavy due to PrimeNG `TableModule` transitive dependencies.

#### H5: ds- selector migration is straightforward — YES

Global find-replace on selectors (`app-button` to `ds-button`) and class names (`AppButton` to `DsButton`) worked cleanly. Angular's template compiler catches stale selectors at build time, so any missed rename fails the build immediately. The `ds-` prefix clearly separates design-system atoms/molecules from page-level components that keep the `app-` prefix.

#### H6: Stylelint color-no-hex enforcement — PARTIAL

Stylelint's `color-no-hex` rule effectively catches violations in `.scss` and `.css` files. However, it cannot inspect inline `styles:` arrays in Angular component TypeScript decorators or `[style]` template bindings. All 11 hex violations found in the prototype were in inline styles — exactly the gap Stylelint cannot cover. The `stylelint-declaration-use-css-custom-properties` plugin was not available on npm (404). A custom ESLint rule or pre-commit grep script is needed for full coverage.

### Usability Hypotheses

#### H7: All 3 user journeys completable — YES

All three journeys (Browse Projects, Search and Filter, Handle Errors) are completable as designed. Organism extraction and `httpResource` wiring provide the necessary data flow. See Section 2 for evidence.

#### H8: Loading/empty/error states implementable with httpResource — YES

The `httpResource` API shape (`value()`, `status()`, `error()`, `isLoading()`) maps directly to the four documented states. [11-prototype-solutions](./11-prototype-solutions.md) patterns (from the POC process docs) worked without modification. Each organism independently manages its own state rendering.

#### H9: States beyond the known 4 discovered — YES

Three additional states were discovered during implementation:

1. **Search-no-results:** Distinct from empty state — uses `pi-search` icon and includes the search term in the message ("No results for '[query]'") with a "Clear search" action button.
2. **Partial failure:** Stats API succeeds while projects API fails — each organism handles its own error independently, so the dashboard renders a mixed state.
3. **Detail skeleton layout:** Form-shaped skeleton with labeled placeholder blocks, distinct from the grid/table skeletons used on dashboard and list pages.

---

## 4. Component Inventory

| Name | Level | Selector | Key Inputs | Key Outputs | States Handled | Tests | Stories |
|------|-------|----------|------------|-------------|----------------|-------|---------|
| DsButton | Atom | `ds-button` | `label`, `severity`, `outlined`, `disabled` | `clicked` | default, hover, focus, active, disabled | 4 | Yes |
| DsTag | Atom | `ds-tag` | `value`, `severity` | — | success, danger, default | 3 | Yes |
| DsInput | Atom | `ds-input` | `placeholder`, `value` (model) | model update | default, focus | 3 | Yes |
| DsEmptyState | Atom | `ds-empty-state` | `icon`, `message`, `actionLabel` | `actionClicked` | with action, without action | 3 | Yes |
| DsStatCard | Molecule | `ds-stat-card` | `label`, `value`, `icon` | — | data | 2 | Yes |
| DsSearchBar | Molecule | `ds-search-bar` | `placeholder`, `value` (model) | `searched` | default, with value | 3 | Yes |
| DsFormField | Molecule | `ds-form-field` | `label`, `fullWidth` | — | default, full-width | 2 | Yes |
| DsStatGrid | Organism | `ds-stat-grid` | `stats`, `isLoading`, `error` | `retryClicked` | loading, error, empty, data | 4 | Yes |
| DsProjectCardGrid | Organism | `ds-project-card-grid` | `projects`, `isLoading`, `error` | `projectSelected`, `retryClicked` | loading, error, empty, data | 4 | Yes |
| DsProjectTable | Organism | `ds-project-table` | `projects`, `isLoading`, `error` | `projectSelected`, `retryClicked` | loading, error, empty, data, search-no-results | 5 | Yes |
| Dashboard | Page | `app-dashboard` | — (uses services) | — | loading, data, partial-failure | 1 | — |
| ListPage | Page | `app-list` | — (uses services) | — | loading, data, filtered, search-no-results | 1 | — |
| Detail | Page | `app-detail` | — (route param) | — | loading, data, not-found | 1 | — |

**Totals:** 36 tests across 13 spec files, 10 story files.

---

## 5. Bundle Size Comparison

| Metric | POC (no lazy loading) | Prototype (lazy loading) | Change |
|--------|----------------------|--------------------------|--------|
| Initial (raw) | 1.06 MB | 540.54 KB | -49% |
| Initial (gzip) | 206 KB | 122.17 KB | -41% |
| Dashboard chunk | N/A | 15.33 KB | lazy |
| List chunk | N/A | 465.93 KB | lazy (TableModule) |
| Detail chunk | N/A | 9.97 KB | lazy |

The list chunk (465.93 KB) is disproportionately large because PrimeNG's `TableModule` pulls in significant transitive dependencies (badge, checkbox, datepicker, dialog, dropdown, paginator, radiobutton, select, tooltip, tree, treetable). The dashboard and detail chunks are small because they use lighter PrimeNG components (cards, skeletons, avatars). Using `@defer` on the table component within the list page could further reduce the lazy chunk size.

---

## 6. Tooling Assessment

### MSW v2
- **Verdict:** Seamless integration with Angular's `httpResource()`.
- MSW's service worker intercepts fetch calls transparently — `httpResource` does not know or care that responses come from a mock.
- Conditional loading via `isDevMode()` + dynamic `import()` ensures zero production impact.
- Fixture data (18 projects, 4 stats, 6 users) provides realistic test scenarios.
- Minor gotcha: TypeScript's `noPropertyAccessFromIndexSignature` requires bracket notation for MSW `params` access.

### Storybook 10
- **Verdict:** Works, but Angular-specific setup is required.
- Must use `ng run <project>:storybook`, not `storybook dev` directly. Direct invocation fails with `SB_FRAMEWORK_ANGULAR_0001 (AngularLegacyBuildOptionsError)`.
- CSS imports in `preview.ts` fail with webpack parse error (`Unexpected character '@'` on `@font-face`) — use CDN link in `preview-head.html` or `angular.json` styles array.
- Compodoc integration auto-generates component documentation via `documentation.json`.
- 10 story files cover all design-system components across atoms, molecules, and organisms.

### Stylelint
- **Verdict:** Effective for `.scss`/`.css` files, blind to inline TypeScript styles.
- `color-no-hex` rule works as expected for stylesheet files (SCSS files were already clean).
- Cannot inspect Angular component `styles:` arrays or `[style]` template bindings.
- All 11 hex violations found in the prototype were in inline styles — 100% in locations Stylelint cannot reach.
- `stylelint-declaration-use-css-custom-properties` plugin not available on npm (404).

### httpResource()
- **Verdict:** Clean signal-based API, but experimental.
- Imported from `@angular/common/http`, marked `@experimental 19.2`.
- API: `.value()`, `.status()`, `.error()`, `.isLoading()`, `.reload()`, `.destroy()`, `.headers()`, `.statusCode()`, `.hasValue()`.
- No `.data()` alias — documentation must reference `.value()`.
- Sub-constructors: `httpResource.text()`, `httpResource.blob()`, `httpResource.arrayBuffer()` for non-JSON responses.
- Recommendation: wrap behind service abstractions to isolate experimental API surface.

### Vitest
- **Verdict:** Fast, minimal setup with Angular 21.
- Angular 21's `@angular/build:unit-test` builder defaults to Vitest.
- 36 tests run in ~2 seconds.
- jsdom environment works for rendering tests; PrimeNG `(onClick)` does not fire via DOM click dispatch — full click-through requires Storybook play functions or Playwright.
- No zone.js or custom polyfills required. Standard `TestBed` works out of the box.

---

## 7. State Discovery

### Search-No-Results (distinct from Empty)
- **Where:** `DsProjectTable` organism
- **Trigger:** User searches for a term with no matching projects (e.g., "zzzzz")
- **Treatment:** `pi-search` icon, message includes search term ("No results for 'zzzzz'"), "Clear search" action button
- **Why it matters:** Visually distinct from the generic empty state (`pi-inbox` icon, "No projects found") — the user needs to know their search produced no results vs. there being no data at all.

### Partial Failure
- **Where:** Dashboard page
- **Trigger:** Stats API succeeds but projects API fails (or vice versa)
- **Treatment:** Each organism independently renders its own state — stats show data while projects show error with retry button
- **Why it matters:** Without independent error handling per organism, a single API failure would blank the entire page. The atomic design pattern naturally supports this because each organism owns its state.

### Detail Skeleton Layout
- **Where:** Detail page
- **Trigger:** Detail page loads while `httpResource` fetches project data
- **Treatment:** Form-shaped skeleton with labeled placeholder blocks, distinct from the grid/table skeletons used on dashboard and list pages
- **Why it matters:** A generic rectangular skeleton would not match the detail page layout, creating a jarring transition when data loads.

### PrimeNG onClick Limitation in jsdom
- **Where:** Unit tests for any component using PrimeNG `p-button`
- **Trigger:** Dispatching `MouseEvent('click')` on a `p-button` element in jsdom
- **Treatment:** PrimeNG's `(onClick)` output does not fire — the internal click handler requires browser-level event processing
- **Why it matters:** Button click-through tests must be deferred to Storybook play functions or Playwright E2E tests. Unit tests can verify output wiring but not full click behavior through PrimeNG wrappers.

---

## 8. Shift-Left QA Assessment

### Acceptance Criteria Written Before Code

43 acceptance criteria were written across atoms (14), molecules (10), organisms (16), and user journeys (10) before any implementation began. Criteria followed the GIVEN/WHEN/THEN format, making them directly translatable to test assertions.

**Assessment:** Effective. The criteria caught the search-no-results state early (before implementation), which might otherwise have been implemented identically to the empty state. The criteria also forced explicit decisions about error and empty state copy (e.g., "Unable to load stats" vs a generic "Something went wrong").

### Storybook Play Functions as Executable Specs

10 story files provide visual validation of all component states (loading, error, empty, data). Play functions can exercise interactions (click, type, navigate) that unit tests in jsdom cannot cover (e.g., PrimeNG button clicks).

**Assessment:** Works well as a complement to unit tests. The two together cover rendering (unit) and interaction (Storybook) without requiring a full E2E runner during the prototype phase.

### Unit Tests Map to Acceptance Criteria

36 tests across 13 spec files map directly to acceptance criteria. Each organism has tests for all four core states (loading, error, empty, data). Page smoke tests confirm render-without-error for all three pages.

**Assessment:** Clear traceability from criteria to tests. The GIVEN/WHEN/THEN format in acceptance criteria translates directly to test structure, making it straightforward to verify that every criterion has a corresponding test.

---

## 9. Documentation Gaps

### Workflow Gaps

| Finding | Impact | Source |
|---------|--------|--------|
| Storybook requires `ng run`, not `storybook dev` | Team hits `SB_FRAMEWORK_ANGULAR_0001` error immediately if following generic Storybook docs | Prototype finding (H3) |
| CSS import in `preview.ts` fails with webpack parse error | Must use CDN link or `angular.json` styles array for PrimeIcons | Prototype finding (H3) |
| `--skip-tests` scaffold omits test target from `angular.json` | Manual setup of `@angular/build:unit-test` builder + vitest/jsdom install required | Prototype finding |
| `--watch=false` flag does not work, must use `--no-watch` | Minor CLI difference from Karma-era Angular | Prototype finding |

### Missing Information

| Finding | Impact | Source |
|---------|--------|--------|
| `httpResource` import path not specified | Team would search multiple packages before finding `@angular/common/http` | Extends [09-angular-direction](./09-angular-direction.md) |
| Docs reference `.data()` but correct accessor is `.value()` | Code would not compile | Extends [09-angular-direction](./09-angular-direction.md) |
| `stylelint-declaration-use-css-custom-properties` plugin not on npm | Cannot enforce custom property usage beyond `color-no-hex` | Extends [02-tooling-landscape](./02-tooling-landscape.md) |
| `httpResource` `@experimental 19.2` status not mentioned | Team unaware of API stability risk | Extends [09-angular-direction](./09-angular-direction.md) |

### Confirmed from POC Docs

| Finding | Status |
|---------|--------|
| Folder structure conventions ([08-project-structure](./08-project-structure.md)) | Confirmed — restructure was mechanical, build passed on first attempt |
| Selector naming `ds-` prefix ([08-project-structure](./08-project-structure.md)) | Confirmed — straightforward, compiler catches stale selectors |
| Mock data patterns ([11-prototype-solutions](./11-prototype-solutions.md)) | Confirmed — MSW setup was smooth |
| State handling patterns ([11-prototype-solutions](./11-prototype-solutions.md)) | Confirmed — loading/error/empty/data patterns worked directly |
| Dark mode via CSS custom properties ([08-project-structure](./08-project-structure.md)) | Confirmed — all components respond to dark mode after hex remediation |
| Bundle size concern with TableModule ([05-parallel-development](./05-parallel-development.md)) | Confirmed — TableModule still dominates lazy chunk at 466 KB |

---

## 10. Recommendations for Production Stage

1. **Replace experimental `httpResource` with stable API when available.** The `@experimental 19.2` tag means the API surface could change. Wrapping behind service abstractions (already done in this prototype) isolates the risk. Monitor Angular release notes for stabilization.

2. **Add E2E tests (Playwright) for user journeys.** The three user journeys are completable but only validated via unit tests and manual inspection. Playwright tests would provide automated regression coverage for navigation flows and PrimeNG button clicks that jsdom cannot handle.

3. **Add visual regression testing (Chromatic) when designer reviews start.** Storybook stories are already in place — connecting Chromatic would catch unintended visual changes across all component states, both light and dark mode.

4. **Extract inline styles to `.scss` files for Stylelint coverage.** All 11 hex violations were in inline TypeScript styles. Moving these styles to component `.scss` files would bring them under Stylelint's reach without needing a custom ESLint rule. Alternatively, add a pre-commit grep script to catch hex values in `.ts` files.

5. **Investigate `@defer` for the list page table to reduce lazy chunk size.** The list chunk is 465.93 KB due to PrimeNG `TableModule` transitive dependencies. Using Angular's `@defer` block to load the table on viewport visibility could further reduce initial page load for the list route.

6. **Add error boundary pattern for unexpected rendering errors.** The current error handling covers API failures (via `httpResource().error()`) but not unexpected rendering errors (e.g., null reference in a template expression). An `ErrorHandler` subclass or `@defer` with error block would provide a fallback UI.

7. **Establish pre-commit hook for hex color detection.** A grep-based check (`grep -rn '#[0-9A-Fa-f]\{3,8\}' src/app/ --include='*.ts'`) in a pre-commit hook would catch inline hex values that Stylelint misses, until a proper ESLint rule is implemented.

8. **Document Angular-specific Storybook setup.** The process docs should explicitly state that Angular projects must use `ng run` commands for Storybook and that CSS imports in `preview.ts` require the CDN workaround or `angular.json` styles array approach.
