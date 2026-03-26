# Quickstart Guide

Start here. This repo contains process documentation for building Angular 21 + PrimeNG 21 applications using Atomic Design principles, targeting small teams (2-4 people).

---

## Read These First (in order)

1. **[01-atomic-hierarchy](./01-atomic-hierarchy.md)** — The 5-level component taxonomy. Understand atoms, molecules, organisms, templates, pages and the cascade rule before anything else.

2. **[08-project-structure](./08-project-structure.md)** — Directory layouts at POC, prototype, and production. Shows where files go, how components are named, and how imports work.

3. **[06-maturity-stages](./06-maturity-stages.md)** — What gets built, changed, and thrown away at each stage. Tells you what quality level to target right now.

## Then Read Based on Your Role

**Developer starting a POC:**
- [03-token-pipeline](./03-token-pipeline.md) — How design tokens flow from Figma to code
- [10-implementation-tips](./10-implementation-tips.md) — Practical gotchas from real implementation
- [07-derisking](./07-derisking.md) — 14 risks to spike early

**Developer starting a prototype:**
- Everything above, plus:
- [11-prototype-solutions](./11-prototype-solutions.md) — MSW, Storybook, httpResource, bundle optimization
- [04-qa-per-atomic-level](./04-qa-per-atomic-level.md) — Testing requirements per level

**BA / Product Owner:**
- [12-pbi-writing-guide](./12-pbi-writing-guide.md) — How to write PBIs at each atomic level
- [05-parallel-development](./05-parallel-development.md) — How design and dev run together

**Designer:**
- [01-atomic-hierarchy](./01-atomic-hierarchy.md) — Component taxonomy maps to Figma components
- [03-token-pipeline](./03-token-pipeline.md) — How your Figma tokens become code
- [05-parallel-development](./05-parallel-development.md) — Your review workflow in Storybook

## Reference Implementation

This repository serves as both the process documentation and the working reference implementation. The Angular 21 prototype in this repo demonstrates the patterns, project structure, and tooling choices described in the docs above -- including atomic component decomposition, design token theming via `definePreset()`, MSW-based API mocking, Storybook stories, and Vitest-based testing. Rather than pointing to a separate repo, you can explore the `src/` directory alongside these docs to see the theory applied in practice.

## Key Concepts (know these before writing code)

- **Cascade rule:** Each level imports only from the level below. Atoms → Molecules → Organisms → Templates → Pages.
- **Maturity is per-component, not per-project.** Your atoms can be production-quality while pages are still POC.
- **definePreset()** is how you theme PrimeNG. It covers ~80% of design needs. The pt API and CSS handle the rest.
- **Never hardcode hex values.** Use `var(--p-surface-50)` etc. Hardcoded hex breaks dark mode.
- **Organisms must handle 4+ states:** loading, error, empty, data (plus search-no-results where applicable).
- **Acceptance criteria before code.** Write Given/When/Then specs before building organisms. This prevents the "2 states and done" trap.

## Before Your First Sprint

Read these two docs before writing any sprint work:
- [10-implementation-tips](./10-implementation-tips.md) — Settle file naming, spike definePreset(), agree on breakpoints
- [12-pbi-writing-guide](./12-pbi-writing-guide.md) — Bottom-up PBI structure with acceptance criteria templates

## Full Doc Index

| # | Doc | Purpose |
|---|-----|---------|
| 00 | Quickstart (this file) | Where to start |
| 01 | Atomic Hierarchy | 5-level component taxonomy |
| 02 | Tooling Landscape | Locked stack + optional accelerators |
| 03 | Token Pipeline | Figma → definePreset() flow |
| 04 | QA Per Atomic Level | Testing requirements per level |
| 05 | Parallel Development | Design + dev working together |
| 06 | Maturity Stages | POC → Prototype → Production |
| 07 | Derisking | 14 risks to spike early |
| 08 | Project Structure | Directory layouts + naming |
| 09 | Angular Direction | Angular 21 features + signal patterns |
| 10 | Implementation Tips | Practical gotchas |
| 11 | Prototype Solutions | MSW, Storybook, httpResource |
| 12 | PBI Writing Guide | PBI templates + BA guide |
