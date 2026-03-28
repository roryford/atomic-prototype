# 06 — Tooling Landscape

> **When to read:** When the team is deciding which tools to adopt. Not needed on day 1. Read time: ~8 minutes.

> **Key principle:** Angular + PrimeNG + Figma are locked in. Everything else is a recommendation to explore. The process must work with zero additional tooling and get better as tools are added.

This doc helps you avoid two traps: adopting too much tooling too early, and not knowing what tools exist when you need them.

---

## 1. Locked-In Stack

These three are non-negotiable. All workflows, manual or automated, build on them.

### Angular 21.x

Application framework. Signal-based reactivity, zoneless change detection, standalone components by default. The CLI provides scaffolding, builds, and a bundled Vitest test runner. Version 22 is expected May 2026.

> **Note:** Pin exact versions in `package.json`, not in process docs. Patch versions drift frequently.

**Relevant to atomic design:** Standalone components map cleanly to atoms, molecules, and organisms. Input signals and output emitters define the component contract at every level.

> **`@angular/animations`:** This package must be installed separately when using `provideAnimationsAsync()` for PrimeNG transitions. It is not included in Angular 21's default scaffold. Run `npm install @angular/animations` and add `provideAnimationsAsync()` to your app config.

### PrimeNG 21.x

UI component library running in unstyled mode. 80+ components with full theme control via design tokens. Its three-tier token architecture (primitive, semantic, component) aligns directly with atomic design thinking.

> **Note:** Pin exact versions in `package.json`, not in process docs. Patch versions drift frequently.

**Relevant to atomic design:** Unstyled mode means PrimeNG components accept your design tokens, not the other way around. You own the visual language.

> **Import style:** Use standalone component imports for atoms (e.g. `import { Button } from 'primeng/button'`). Use module imports (e.g. `TableModule`) only for complex organism primitives that require template directives like `pTemplate` and `pSortableColumn`. Standalone imports keep atom bundles small and dependency trees explicit.

### Figma

Design source of truth. All design decisions — colours, spacing, typography, component structure — originate here. Dev Mode provides developer inspection with token-aware annotations and CSS output.

**Relevant to atomic design:** Figma components mirror Angular components. One Figma atom = one Angular atom. The mapping is intentional and explicit.

---

## 2. Tool Landscape by Function

Every function below can be done manually. Tools are accelerators you adopt when the manual approach becomes a bottleneck.

| Function | Manual Approach | Tools to Evaluate | Evaluate When |
|---|---|---|---|
| Design token extraction | Inspect Figma, create JSON by hand | Tokens Studio (free; Pro tier adds Git sync — paid), Figma Variables API. Packages: `@tokens-studio/sd-transforms`, `@tokens-studio/dtcg-convert` | POC — if manual token sync is painful |
| Token transformation | Hand-write SCSS/preset files from JSON | Style Dictionary v5 | Prototype — if token count exceeds ~50 |
| Token format standard | Use your own JSON schema | W3C DTCG spec (free, open standard) | Prototype — when setting up the pipeline |
| PrimeNG theming (premium) | `definePreset()` with hand-authored tokens | PrimeOne UI Kit v4 + Theme Designer Extended (paid) | Prototype — if manual dark mode mapping is painful or token count is high |
| Token pipeline CI | Run `npm run build:tokens` manually | `figma-to-theme-code-generator` GitHub Action (PrimeNG), Tokens Studio Pro Git sync (paid) | Production — when token changes need automated PRs |
| Component development | Build and test in the app directly | Storybook 10 (free, open source). **Angular caveat:** use `ng run <project>:storybook`, not `storybook dev` directly. CSS imports in `preview.ts` fail — use `angular.json` styles array or CDN link in `preview-head.html`. | Prototype — when reviewing components in isolation matters |
| Visual regression | Manual side-by-side review (Storybook vs Figma) | Chromatic (easiest, free tier 5K snapshots/month, Modes feature for dark mode), Percy (free tier available), BackstopJS (open source, self-hosted), Playwright `toHaveScreenshot()` (built-in, no external service) | Production — when manual visual review does not scale |
| Unit testing | Angular CLI default (Vitest in v21). **Note:** PrimeNG `(onClick)` does not fire via DOM click in jsdom. Full interaction testing requires Storybook play functions or Playwright. | Already bundled — no procurement needed | Day 1 |
| E2E testing | Manual testing of user flows | Cypress (free), Playwright (free) | Prototype — when core flows are stable enough to automate |
| Accessibility testing | Manual keyboard + screen reader testing | axe-core (free, recommended standard), pa11y (free), Storybook a11y addon (free). **Gate:** zero critical/serious violations. | Prototype — from first atom |
| CSS/SCSS linting | Manual code review | Stylelint + `color-no-hex` rule | POC — from first component |
| Code formatting | Manual style adherence | Prettier (free) | POC — from first component |
| TypeScript linting | Manual code review | ESLint + `@angular-eslint` (free) | Prototype — when team grows past 2 |
| Bundle analysis | Check build output sizes | source-map-explorer (free, recommended), webpack-bundle-analyzer | Prototype — when initial bundle exceeds budget |
| Performance monitoring | Manual Lighthouse audits | Lighthouse CI (free) | Production — when performance budgets are enforced in CI |
| CI/CD pipeline | Manual build + test + deploy | GitHub Actions (free for public repos) | Prototype — when PRs need automated checks |
| API mocking | Hardcoded data in components | MSW (free, open source) | Prototype — when organisms need realistic data |
| Monorepo management | Single Angular project (Angular CLI) | Nx (free, open source) | Only if multiple apps consume the design system |
| AI-assisted development | Manual implementation from Figma inspection | Figma MCP Server (free), Angular CLI MCP (experimental) | POC — low-cost experiment |
| Code generation from Figma | Manual implementation | Builder.io, Figmular, Codigma | POC — if speed matters more than structure |

---

## 3. Architecture Diagram

Tools are optional accelerators at every step. The pipeline works without them.

```
Figma ──► [Token extraction] ──► [Token transformation] ──► Angular + PrimeNG
           manual or tool          manual or tool

                            │
                            ▼
                    [Component dev]
                     manual or tool
                            │
                            ▼
                    [Testing & QA]
                     manual or tool
```

**With no additional tooling:**
```
Figma ──► Inspect values ──► Write JSON by hand ──► Write SCSS/preset by hand ──► Angular + PrimeNG
```

**With full tooling adopted:**
```
Figma ──► Tokens Studio ──► Style Dictionary ──► Angular + PrimeNG
  │           (DTCG)           (SCSS, CSS,          │
  │                            preset.ts)           │
  ▼                                                 ▼
Figma MCP ──► AI Agent ──► Angular CLI MCP    Storybook ──► Chromatic
                                                  │
                                              Vitest + Playwright
                                                  │
                                              Stylelint + ESLint + Prettier
                                                  │
                                              GitHub Actions CI
```

Both paths produce the same output. The second is faster at scale.

---

## 4. Procurement Decision Guide

**Evaluate a tool when the manual approach becomes a bottleneck. Not before.**

Ask these questions before procuring or adopting anything:

| Pain Point | Question to Ask | If Yes, Consider |
|---|---|---|
| Token sync takes too long | Are you spending >30 min per design update translating Figma values to code? | Tokens Studio, Figma Variables API |
| Token files are error-prone | Are manual SCSS/preset edits introducing bugs? | Style Dictionary v5 |
| Component review is slow | Do reviewers need to pull the branch and run the app to see a component? | Storybook |
| Visual bugs slip through | Are you catching design regressions after merge, not before? | Chromatic, Percy, BackstopJS |
| Test coverage is guesswork | Do you lack confidence that a component change did not break something? | Vitest (already bundled), Cypress, Playwright |
| Accessibility is an afterthought | Are a11y issues found late in QA or by users? | axe-core, pa11y |
| Scaffolding is repetitive | Are you copy-pasting boilerplate for every new component? | Figmular, Builder.io, Angular CLI MCP |
| Build times are growing | Is CI taking >10 min on incremental changes? | Nx |
| Dark mode token mapping is manual | Are you hand-authoring `colorScheme.dark` for 50+ tokens? | PrimeOne UI Kit v4 (auto-generates light/dark from Figma Variable modes) |
| Hardcoded hex values keep appearing | Are hex values slipping past code review into component styles? | Stylelint `color-no-hex` + pre-commit hook for inline styles |
| Bundle size is growing | Is the production bundle exceeding 500KB raw? | source-map-explorer + `@defer` blocks + lazy loading |
| CI has no quality gates | Can broken code or failing tests merge to main? | GitHub Actions: lint → test → build on PR |
| Performance regressions go unnoticed | Are users reporting slowness before you catch it? | Lighthouse CI with budget thresholds |

**Decision rule:** If the manual approach works and the team is not blocked, do not add tooling. Complexity has a cost. Every tool you adopt is a dependency you maintain.

---

## 5. Lessons from the Prototype

The simulation phase validated several tools against real Angular 21 + PrimeNG 21 code. Summary:

| Tool | Verdict | Key Finding |
|------|---------|-------------|
| MSW v2 | Seamless | Network-level interception works perfectly with `httpResource()` |
| Storybook 10 | Works, with caveats | Must use `ng run`; CSS import workaround needed |
| Stylelint | Partial coverage | Catches hex in `.scss` but blind to inline TypeScript styles |
| Vitest | Fast, minimal setup | 36 tests in ~2s; jsdom limitation with PrimeNG clicks |
| `httpResource()` | Clean but experimental | `@experimental 19.2` — wrap behind service methods to isolate risk |
| ESLint + angular-eslint | Smooth setup, valuable | Schematic handles config; needs `eslint-config-prettier` for Prettier coexistence; selector rules need both `app` and `ds` prefixes; two template a11y rules need inline suppression for `ng-content` and delegating wrappers |
| Playwright | Seamless with MSW | MSW service worker intercepts transparently — no extra E2E mock setup; PrimeNG `p-button` with `[link]="true"` renders as `<button>`, not `<a>`; deterministic mock data enables hardcoded assertions |
| GitHub Actions CI | Straightforward | Node 25 via `.nvmrc`; `ng test` needs `--watch=false` for CI; Storybook deploys to GitHub Pages on merge to main |

These verdicts informed the "Evaluate When" column in Section 2. None of the tools required significant configuration effort, but each had at least one gotcha worth knowing in advance. ESLint, Playwright, and GitHub Actions CI were adopted during the enhanced prototype phase, confirming their "Evaluate When" recommendations.

For detailed findings, see [simulation-report](./simulation-report.md).

---

## 6. Angular Feature Stability

Quick reference for which Angular features are safe to depend on today.

| Feature | Status | Guidance |
|---------|--------|----------|
| Signal inputs/outputs | Stable | Use everywhere — the standard for component APIs |
| Zoneless change detection | Stable | Default in Angular 21, no action needed |
| `@defer` blocks | Stable | Use for lazy-loading heavy organisms |
| `httpResource()` | Experimental (19.2) | Wrap behind services; fallback: `toSignal(http.get())` |
| Signal Forms | Developer Preview | Do not depend on; use facade pattern for future swap |
| Selectorless components | RFC | Do not depend on; name classes cleanly for eventual migration |

For full Angular feature details, see [09-angular-direction](./09-angular-direction.md).

---

## Cross-References

- Token pipeline detail (three paths, dark mode): [05-token-pipeline](./05-token-pipeline.md)
- Angular feature status and signal patterns: [09-angular-direction](./09-angular-direction.md)
- Practical setup instructions and gotchas: [11-implementation-tips](./11-implementation-tips.md)
- QA checklists per atomic level: [07-qa-per-atomic-level](./07-qa-per-atomic-level.md)
- Simulation tool verdicts: [simulation-report](./simulation-report.md)
