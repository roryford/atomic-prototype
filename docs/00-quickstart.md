# Quickstart Guide

> **Who is this for?** Anyone joining this project or evaluating this approach. Read time: 2 minutes.

Start here. This repo contains process documentation for building Angular 21 + PrimeNG 21 applications using Atomic Design principles, targeting small teams (2-4 people).

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
All of the above, plus [05-token-pipeline](./05-token-pipeline.md) -> [07-qa-per-atomic-level](./07-qa-per-atomic-level.md) -> [10-derisking](./10-derisking.md)

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
| [design-spec](./design-spec.md) | Design specification (includes prototype extensions) |
| [simulation-report](./simulation-report.md) | Simulation findings |
| [acceptance-criteria](./acceptance-criteria.md) | Acceptance criteria |
| [manual-test-checklist](./manual-test-checklist.md) | Manual test checklist |
| [production-plan-sketch](./production-plan-sketch.md) | Production plan sketch |
