# Production Stage Plan Sketch

> For maturity stage definitions and exit criteria, see [02-maturity-stages](./02-maturity-stages.md).

A discussion outline for what a production-stage simulation would involve. This is not an executable plan -- it is a sketch of scope, decisions, and sequencing to be refined with real team input.

---

## 1. What Changes at Production

From the maturity stages documentation, the prototype-to-production transition adds:

| What | From (Prototype) | To (Production) |
|------|-------------------|-----------------|
| Data source | MSW mocked services | Real API calls with auth, pagination, caching |
| Error handling | `httpResource().error()` with retry buttons | Error boundaries, fallback UI, retry logic, global `ErrorHandler` |
| Test coverage | 36 unit tests + 10 Storybook stories, manual walkthroughs | Automated unit, integration, E2E, visual regression |
| Accessibility | Basic keyboard nav, manual checks | axe-core in CI, screen reader tested, ARIA complete |
| Performance | "Seems fast enough" (540KB initial, 122KB gzip) | Measured against budgets, optimized (500KB warn / 800KB error raw) |
| Dark mode | Developer-invented `colorScheme.dark` values | Designer-specified dark palette, automated visual verification |
| Additional | Not addressed | RTL, print styles if required by audience |

Nothing is thrown away at random. The component file structure, design token variable names, Angular module hierarchy, and route configuration all survive. What gets replaced: MSW mock services, hardcoded auth tokens, and prototype-specific workarounds.

---

## 2. Prototype Readiness Assessment

### Closest to Production

**Atoms (4 components).** Small, self-contained, fully tested. All `input()`/`output()` contracts defined. Dark mode works after hex remediation. These could reach production quality with the addition of axe-core CI checks and visual snapshots.

**Templates.** Not explicitly built in the prototype simulation, but the layout patterns are established. Templates have low complexity and no business logic -- they mature fast.

### Largest Gaps

**Organisms (3 components).** This is where most production risk lives. Current state:
- All four core states handled (loading, error, empty, data) plus search-no-results and partial failure
- But: using `httpResource()` which is `@experimental 19.2` -- API surface could change
- But: no real API integration, no auth, no pagination, no caching
- But: no E2E test coverage for state transitions
- List page lazy chunk is 466KB due to TableModule transitive dependencies -- needs `@defer` or tree-shaking

**Pages (3 components).** Only smoke tests exist (render-without-error). No E2E coverage, no route guard testing against real auth, no performance budget enforcement, no cross-browser verification.

**Dark mode.** Works mechanically, but the dark palette was developer-invented. No designer-specified dark values. No automated visual verification (would need Chromatic Modes or Playwright theme-toggle snapshots).

**Inline style hex values.** 11 violations were found and fixed, but Stylelint cannot inspect TypeScript `styles:` arrays. No automated prevention exists beyond PR review checklist items.

---

## 3. Key Decisions Needed Before Production

These are choices the team must make -- there is no single right answer.

### Token Pipeline

**Option A: Manual `definePreset()`.** Continue hand-authoring the preset file. Works at current scale (< 50 tokens). Breaks down at 50-200 tokens.

**Option B: Style Dictionary automation.** Tokens Studio (free) exports DTCG JSON, Style Dictionary v5 transforms it, a custom format (~50-100 lines) generates `definePreset()` TypeScript. Cost: $0 + dev time. Dark mode requires manual `colorScheme.dark` authoring in the custom format.

**Option C: PrimeOne paid stack.** PrimeOne UI Kit v4 + Theme Designer Extended. Figma Variable modes auto-generate both light and dark presets. Optional CI via `primefaces/figma-to-theme-code-generator` GitHub Action. Cost: paid license.

**Decision needed:** Is the current token count growing? Does the team need automated dark mode generation? Is budget available for Path C?

### CI/CD Pipeline

The process docs recommend starting simple:

**On PR:** Lint (ESLint + Prettier) -> Unit + Integration Tests -> Storybook Build

**On merge to main:** E2E tests (Playwright) -> Deploy to staging

**Add when pain justifies it:**
- Visual regression (Chromatic/Percy) when visual regressions slip through PRs
- axe-core check when accessibility issues reach production
- Bundle size check when size creeps up unnoticed
- Lighthouse CI when performance degrades without anyone noticing

**Decision needed:** What is the merge target? Is there a staging environment? Who monitors CI failures?

### E2E Testing

Playwright is the recommended tool. Three user journeys are already defined and validated manually:
1. Browse Projects (dashboard -> detail -> list)
2. Search and Filter (list -> search -> filter -> detail)
3. Handle Errors (404, partial failure, retry)

**Decision needed:** Run E2E on every PR or only on merge? How to handle flaky tests (retries: 2, quarantine after one week)?

### Visual Regression

**Option A: Chromatic.** Simplest for small teams. Auto-snapshots every Storybook story. Modes feature tests light/dark and viewports from the same story. Free tier: 5,000 snapshots/month.

**Option B: Self-hosted.** Playwright `toHaveScreenshot()` for visual comparison. No external service dependency. More setup, more maintenance.

**Decision needed:** Is the free Chromatic tier sufficient? Is external service acceptable? Is dark mode visual regression a priority?

### Performance Budgets

Recommended thresholds from the process docs:

| Metric | Warning | Error |
|--------|---------|-------|
| Initial bundle (raw) | 500KB | 800KB |
| Transfer size (gzip) | 150KB ceiling | -- |
| Lighthouse performance | 80 | 75 |
| Lighthouse accessibility | 90 | 85 |
| LCP | -- | < 2.5s |
| INP | -- | < 200ms |
| CLS | -- | < 0.1 |

Current prototype: 540KB raw / 122KB gzip. Already above the 500KB production warning threshold.

**Decision needed:** Are these thresholds realistic for this application? Run Lighthouse 3x and take median?

### Error Monitoring

Angular has no component-level error boundaries (feature request open since 2017). Current layers:
- Per-resource: `httpResource().error()` signal (template-level)
- Per-organism: `catchError` in Observable pipelines
- Global: `ErrorHandler` service override

**Decision needed:** What external monitoring tool (Sentry, Datadog, etc.)? Is the global `ErrorHandler` sufficient or does the team need per-organism error boundaries via `@defer` error blocks?

### Real API Integration

**Contract-first approach recommended:** Agree on TypeScript interfaces with backend. Generate from OpenAPI specs if available. Current MSW handlers define the expected shapes (4 endpoints, fixture data for 18 projects, 4 stats, 6 users).

**Decision needed:** Are backend APIs available? Is there an OpenAPI spec? Who owns the contract? Can MSW handlers be generated from the spec to keep mocks and reality aligned?

---

## 4. Proposed Production Simulation Waves

High-level sequencing. Each wave builds on the previous.

### Wave 1: CI/CD Pipeline + E2E Test Infrastructure

- Set up CI pipeline (lint -> unit tests -> Storybook build on PR; E2E on merge)
- Write Playwright E2E tests for the three user journeys
- Add axe-core accessibility checks to CI
- Establish bundle size budget check on PR
- Decide on Playwright retry/quarantine policy for flaky tests

**Why first:** Everything else depends on automated verification. Without CI, production quality is unenforceable.

### Wave 2: Real API Integration (or Contract-Tested Mocks)

- Replace MSW handlers with real API calls (or generate MSW handlers from OpenAPI spec)
- Implement real auth flow (OAuth redirect, token storage, refresh, role-based guards)
- Handle real pagination, caching, and error shapes
- Address `httpResource()` experimental status (wrap behind services if not already done; prepare `toSignal` fallback)

**Why second:** Real APIs expose latency, error shapes, and auth complexity that mocks hide. This is the hardest transition and the one most likely to reveal new states and failure modes.

### Wave 3: Performance Budgets + Bundle Optimization

- Enforce performance budgets in CI (Lighthouse CI on merge)
- Apply `@defer` to the list page table (466KB lazy chunk)
- Run `source-map-explorer` to identify remaining tree-shaking opportunities
- Test with realistic data volumes (1,000+ items in tables/lists)
- Verify virtual scrolling or pagination strategy at scale

**Why third:** Performance work is most meaningful after real APIs are integrated. Mock data hides latency and volume issues.

### Wave 4: Full Accessibility Compliance

- axe-core in CI with zero critical/serious violations gate
- Screen reader testing (VoiceOver, NVDA) on 2-3 representative flows including modals and data tables
- Complete ARIA attributes across all components
- Focus management: modal traps, skip nav, focus restoration after navigation
- Verify keyboard navigation end-to-end for all three user journeys

**Why fourth:** Accessibility work is ongoing, but the intensive pass should happen after components are stable. Fixing a11y on components that are still changing creates rework.

### Wave 5: Error Boundaries + Monitoring + Production Polish

- Implement global `ErrorHandler` override with external monitoring integration
- Add `@defer` error blocks as component-level error boundaries where appropriate
- Designer-specified dark mode palette (replace developer-invented values)
- Automated dark mode visual verification (Chromatic Modes or Playwright snapshots)
- Extract remaining inline styles to `.scss` for Stylelint coverage
- RTL and print styles if audience requires them
- Cross-browser verification (Chrome, Firefox, Safari; Edge in CI if available)

**Why last:** Polish and monitoring are most valuable when the application is functionally complete. Adding Sentry to a prototype is premature; adding it to a production-ready app is essential.

---

## 5. Open Questions

These need real team input before the plan can be finalized.

### Team and Process
- Who extends the design spec for dark mode, loading/error/empty states? (The prototype found nobody owns this in current process docs.)
- Is there a BA role for organism-level requirements, or do developers write acceptance criteria?
- What is the sprint cadence? How far ahead does design finalize components?

### Technical
- Is `httpResource()` expected to stabilize before the team reaches production? If not, when does the team switch to the `toSignal` fallback?
- Is the backend providing an OpenAPI spec? If so, can TypeScript interfaces and MSW handlers be generated from it?
- Does the application need SSR or prerendering? (This would significantly change the production simulation scope.)
- What is the target browser matrix? Is IE/legacy Edge completely excluded?

### Infrastructure
- Is there a staging environment for E2E tests to run against?
- Is there budget for Chromatic, or is the team self-hosting visual regression?
- What monitoring/alerting tool is the organization standardized on?
- Is there an existing CI/CD platform (GitHub Actions, GitLab CI, Azure DevOps)?

### Scope
- Are there additional pages or user journeys beyond the three simulated?
- Is internationalization (i18n) in scope? This affects component text handling and would need to be addressed before or alongside RTL.
- What is the actual user base size? This affects performance budget strictness and monitoring urgency.
