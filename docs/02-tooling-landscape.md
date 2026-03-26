# 02 — Tooling Landscape

> **Key principle:** Angular + PrimeNG + Figma are locked in. Everything else is a recommendation to explore. The process must work with zero additional tooling and get better as tools are added.

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
| Design token extraction | Inspect Figma, create JSON by hand | Tokens Studio (free), Figma Variables API | POC — if manual token sync is painful |
| Token transformation | Hand-write SCSS/preset files from JSON | Style Dictionary v5 | Prototype — if token count exceeds ~50 |
| Token format standard | Use your own JSON schema | W3C DTCG spec (free, open standard) | Prototype — when setting up the pipeline |
| Component development | Build and test in the app directly | Storybook 10 (free, open source) | Prototype — when reviewing components in isolation matters |
| Visual regression | Manual side-by-side review (Storybook vs Figma) | Chromatic, Percy (free tiers), BackstopJS (free) | Production — when manual visual review does not scale |
| Unit testing | Angular CLI default (Vitest in v21) | Already bundled — no procurement needed | Day 1 |
| E2E testing | Manual testing of user flows | Cypress (free), Playwright (free) | Prototype — when core flows are stable enough to automate |
| Accessibility testing | Manual keyboard + screen reader testing | axe-core (free), pa11y (free), Storybook a11y addon (free) | Prototype — from first atom |
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
                                              Vitest + Cypress/Playwright
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

**Decision rule:** If the manual approach works and the team is not blocked, do not add tooling. Complexity has a cost. Every tool you adopt is a dependency you maintain.

---

## Cross-References

- For token pipeline detail: see [03 — Token Pipeline](03-token-pipeline.md)
- For Angular architectural direction: see [09 — Angular Direction](09-angular-direction.md)
