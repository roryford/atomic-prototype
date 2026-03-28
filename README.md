# Atomic Design Prototype

An Angular 21 + PrimeNG 21 prototype demonstrating atomic design methodology for small teams.

## What Is This?

This is a working prototype that demonstrates how to build a component library
using Brad Frost's Atomic Design principles in Angular 21 with PrimeNG 21. It
pairs real, runnable components with the process documentation a small team
needs to adopt atomic design without guesswork.

The repository includes process documentation (13 guides covering hierarchy,
tokens, QA, tooling, and maturity stages) alongside working code (4 atoms,
3 molecules, 3 organisms, and 3 pages). Every component is exercised in
Storybook and covered by Vitest unit tests.

Target audience: small teams (2-4 developers) building design systems. This
prototype is useful for learning atomic design concepts, Angular 21 patterns
(signals, httpResource, standalone components), and the surrounding process
(PBIs, acceptance criteria, testing strategy).

## Atomic Design Hierarchy

```
Atoms                    Molecules                 Organisms
------------------       -------------------       -------------------------
DsButton                 DsSearchBar               DsStatGrid
DsInput                  DsStatCard                DsProjectCardGrid
DsTag                    DsFormField               DsProjectTable
DsEmptyState
                                                   Pages
                                                   -------------------------
                                                   Dashboard
                                                   List
                                                   Detail
```

## Quick Start

```
Prerequisites: Node 25+, npm 11+

git clone https://github.com/roryford/atomic-prototype.git
cd atomic-prototype
npm install
npm start              # Dev server at http://localhost:4200
npm run storybook      # Component library at http://localhost:6006
npm test               # 36 unit tests via Vitest
npm run lint           # ESLint (TypeScript + templates)
npm run lint:fix       # ESLint auto-fix
npm run e2e            # Playwright E2E tests (headless)
npm run e2e:ui         # Playwright E2E with UI
```

## Project Structure

```
src/app/
  design-system/
    atoms/        — Button, Input, Tag, EmptyState
    molecules/    — SearchBar, StatCard, FormField
    organisms/    — StatGrid, ProjectCardGrid, ProjectTable
    tokens/       — PrimeNG theme preset, design tokens
  pages/          — Dashboard, List, Detail
  services/       — ProjectService (httpResource-based)
  mocks/          — MSW handlers + fixture data
docs/             — Process guides (00-12) + prototype findings
```

## Documentation

See [docs/README.md](./docs/README.md) for the full documentation index. Highlights:

- [Atomic hierarchy definitions](./docs/01-atomic-hierarchy.md)
- [Maturity stages](./docs/02-maturity-stages.md)
- [QA per atomic level](./docs/07-qa-per-atomic-level.md)
- [Simulation report and findings](./docs/simulation-report.md)
- [Production plan sketch](./docs/production-plan-sketch.md)

## Tech Stack

- Angular 21.2, PrimeNG 21.1, Storybook 10.3, Vitest 4.1, MSW 2.12, TypeScript 5.9
- ESLint (via angular-eslint), Playwright (E2E), GitHub Actions (CI/CD)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions and guidelines.

## License

MIT — see [LICENSE](./LICENSE).
