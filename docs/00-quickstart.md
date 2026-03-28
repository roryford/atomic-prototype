# Quickstart Guide

> **Who is this for?** Anyone joining this project or evaluating this approach. Read time: 2 minutes.

Start here. This repo contains process documentation for building Angular 21 + PrimeNG 21 applications using Atomic Design principles, targeting small teams (2-4 people).

## Why Atomic Design?

**What it gives you.** On a team of 2-4 developers sharing a codebase, the same problems keep showing up: a button looks one way on the dashboard and another way on the detail page, two people build slightly different search bars in the same sprint, a designer hands off specs that don't map to anything in code, and edge-case states (empty, error, loading) get handled inconsistently -- or not at all. Atomic structure fixes this by giving every component a single home with a clear API. New team members can explore the design system directory and know immediately what's available instead of grepping through pages. The result is less rework, faster PR reviews, and fewer "why does this look different over here?" bugs.

**When NOT to use it.** Be honest with yourself about scope. If you're building a one-page internal tool, a throwaway prototype you won't maintain past next month, or you're a solo developer who already knows every corner of the codebase -- the overhead of atoms/molecules/organisms isn't worth it. Same if the team has zero Angular experience; learn Angular first, then layer on structure. Below roughly 5-10 components, flat organisation is fine.

**Why not just use PrimeNG directly?** You can, and it's faster on day one. The tradeoff hits later. When every page imports PrimeNG components directly, you've coupled your entire app to one library's API. Swapping or upgrading PrimeNG means touching every consumer. Worse, each page ends up reimplementing its own loading states, error handling, and empty states around PrimeNG primitives. Wrapping PrimeNG in thin atoms and composing those into organisms centralises that logic. The wrapper cost is small; the consistency payoff compounds every sprint.

---

## After This, Read the Foundations (in order)

You're in the right place. After this page, continue with:

1. **[01-atomic-hierarchy](./01-atomic-hierarchy.md)** -- Component taxonomy and cascade rule
2. **[02-maturity-stages](./02-maturity-stages.md)** -- POC, Prototype, Production quality levels
3. **[03-project-structure](./03-project-structure.md)** -- Where files go, how they're named

Then pick your role-based path below.

## Reading Path by Role

**Developer (new to the project):**
00 -> 01 -> 02 -> 03 -> [11-implementation-tips](./11-implementation-tips.md) -> explore `src/`

**Developer (prototype work):**
All of the above, plus [05-token-pipeline](./05-token-pipeline.md) -> [07-qa-per-atomic-level](./07-qa-per-atomic-level.md) -> [10-derisking](./10-derisking.md) -> [production-plan-sketch](./production-plan-sketch.md) (for Wave 1 implementation status)

**BA / Product Owner:**
00 -> 01 -> 02 -> [08-pbi-and-ba-guide](./08-pbi-and-ba-guide.md) -> [acceptance-criteria](./acceptance-criteria.md)

**Designer:**
00 -> 01 -> [05-token-pipeline](./05-token-pipeline.md) -> [04-parallel-development](./04-parallel-development.md) -> [design-spec](./design-spec.md)

**Tech Lead:**
00 -> 01 -> 02 -> [06-tooling-landscape](./06-tooling-landscape.md) -> [simulation-report](./simulation-report.md)

## See It in Code

This repo is a working prototype. Explore these files to see the hierarchy in practice:

- **Atom:** `src/app/design-system/atoms/button/button.ts`
- **Molecule:** `src/app/design-system/molecules/search-bar/search-bar.ts`
- **Organism:** `src/app/design-system/organisms/project-table/project-table.ts`
- **Page:** `src/app/pages/dashboard/dashboard.ts`

The prototype includes CI, linting, and E2E testing. Run `npm run lint` for ESLint, `npm run e2e` for Playwright E2E tests. CI runs automatically on PRs via GitHub Actions (`.github/workflows/ci.yml`).

## What's Implemented

This prototype includes:

- **4 atoms:** DsButton, DsTag, DsInput, DsEmptyState
- **3 molecules:** DsStatCard, DsSearchBar, DsFormField
- **3 organisms:** DsStatGrid, DsProjectCardGrid, DsProjectTable
- **3 pages:** Dashboard, List, Detail
- **Tooling:** CI (GitHub Actions), ESLint, Stylelint, Playwright E2E, Storybook, Vitest, MSW mocks

Not yet implemented: templates (directory exists as placeholder), real API integration, authentication, visual regression testing, axe-core in CI, performance budgets in CI.

## Screenshots

| Dashboard (light) | Dashboard (dark) |
|---|---|
| ![Dashboard light mode](./screenshots/dashboard-light.png) | ![Dashboard dark mode](./screenshots/dashboard-dark.png) |

| List page | Detail page | Error state |
|---|---|---|
| ![List page](./screenshots/list-table.png) | ![Detail page](./screenshots/detail-page.png) | ![Error state](./screenshots/detail-error.png) |

| Mobile (375px) | Wide (1440px) |
|---|---|
| ![Dashboard mobile](./screenshots/dashboard-mobile.png) | ![Dashboard wide](./screenshots/dashboard-wide.png) |

> Screenshots are captured programmatically via `npx playwright test e2e/screenshots.spec.ts`. Re-run to update after visual changes.

## Reference Implementation

This repository serves as both the process documentation and the working reference implementation. The Angular 21 prototype in this repo demonstrates the patterns, project structure, and tooling choices described in the docs above -- including atomic component decomposition, design token theming via `definePreset()`, MSW-based API mocking, Storybook stories, and Vitest-based testing. Rather than pointing to a separate repo, you can explore the `src/` directory alongside these docs to see the theory applied in practice.

## Full Doc Index

### Foundations

| # | Doc | What it answers |
|---|-----|-----------------|
| 00 | [Quickstart](./00-quickstart.md) (this file) | Where to start, reading paths by role |
| 01 | [Atomic Hierarchy](./01-atomic-hierarchy.md) | 5-level component taxonomy and cascade rule |
| 02 | [Maturity Stages](./02-maturity-stages.md) | POC, Prototype, Production quality levels |
| 03 | [Project Structure](./03-project-structure.md) | Directory layouts, naming, imports |

### Building

| # | Doc | What it answers |
|---|-----|-----------------|
| 04 | [Parallel Development](./04-parallel-development.md) | How design and dev run together |
| 05 | [Token Pipeline](./05-token-pipeline.md) | Figma -> definePreset() flow |
| 06 | [Tooling Landscape](./06-tooling-landscape.md) | Locked stack + optional accelerators |
| 07 | [QA Per Atomic Level](./07-qa-per-atomic-level.md) | Testing requirements per level |
| 08 | [PBI and BA Guide](./08-pbi-and-ba-guide.md) | PBI templates + BA guide |

### Reference

| # | Doc | What it answers |
|---|-----|-----------------|
| 09 | [Angular Direction](./09-angular-direction.md) | Angular 21 features + signal patterns |
| 10 | [Derisking](./10-derisking.md) | Risks to spike early |
| 11 | [Implementation Tips](./11-implementation-tips.md) | Practical gotchas from real implementation |

### Prototype Findings

| Doc | What it answers |
|-----|-----------------|
| [component-catalogue](./component-catalogue.md) | Visual reference for every component (atoms → molecules → organisms) |
| [design-spec](./design-spec.md) | Design specification (includes prototype extensions) |
| [simulation-report](./simulation-report.md) | Simulation findings |
| [acceptance-criteria](./acceptance-criteria.md) | Acceptance criteria |
| [manual-test-checklist](./manual-test-checklist.md) | Manual test checklist |
| [production-plan-sketch](./production-plan-sketch.md) | Production plan sketch |
