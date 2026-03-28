# Contributing to atomic-prototype

## Prerequisites

- Node.js 25+ (see `.nvmrc`)
- npm 11+

## Getting Started

```bash
git clone https://github.com/roryford/atomic-prototype.git
cd atomic-prototype
npm install
npm start          # Dev server on http://localhost:4200
npm run storybook  # Storybook on http://localhost:6006
```

## Running Tests

```bash
npm test              # Unit tests (Vitest + jsdom)
npm run e2e           # E2E tests (Playwright, headless)
npm run e2e:ui        # E2E tests with Playwright UI
```

Unit tests use **Vitest** with **jsdom** as the DOM environment. Test files live alongside their components as `*.spec.ts`.

E2E tests use **Playwright** and live in the `e2e/` directory. They cover navigation/routing, dashboard, and project flows. The dev server must be running (`npm start`) or Playwright will start one automatically per `playwright.config.ts`.

## Storybook

Always start Storybook through the Angular CLI wrapper:

```bash
npm run storybook
```

This runs `ng run atomic-prototype:storybook` under the hood. Do **not** run `storybook dev` directly -- it will bypass Angular's build pipeline and fail.

## Code Style

- **Prettier** for formatting (config: `.prettierrc`)
- **Stylelint** for SCSS linting (config: `.stylelintrc.json`)
- **ESLint** for TypeScript/Angular linting (config: `eslint.config.js`, via `@angular-eslint`)

Before committing:

```bash
npm run format
npm run lint:styles
npm run lint          # ESLint — checks TypeScript and templates
npm run lint:fix      # ESLint — auto-fix what it can
```

## Design System

Components live in `src/app/design-system/` organized by atomic level:

```
src/app/design-system/
  atoms/          # Buttons, inputs, labels, icons
  molecules/      # Form fields, search bars, card headers
  organisms/      # Data tables, forms, dashboards
```

Shared SCSS utilities live in `src/app/design-system/_shared.scss`. This file contains reusable classes and mixins extracted from organisms:

- `.state-container` -- standard layout for loading/error/empty states (use in new organisms instead of duplicating)
- `@include responsive-grid(...)` -- responsive CSS grid mixin (use for card/grid layouts)

Import it in organism SCSS files with `@use '../shared' as *;` or `@use '../../_shared' as *;` depending on depth.

Each component gets its own folder containing:

- `component-name.ts` -- component logic and template
- `component-name.spec.ts` -- unit tests
- `component-name.stories.ts` -- Storybook stories

## CI

GitHub Actions runs automatically on PRs with these checks:

- `format:check` (Prettier)
- `lint:styles` (Stylelint)
- `lint` (ESLint)
- `test` (Vitest unit tests)
- `build` (Angular production build)

On merge to main, Storybook deploys to GitHub Pages.

## PR Guidelines

- Include **unit tests** for all new components.
- Include **Storybook stories** for every design system component.
- Organisms must handle all four states: **loading**, **error**, **empty**, and **data**.
- Run `npm test`, `npm run lint`, and `npm run format:check` before opening a PR (CI will catch these, but local checks are faster).
- Keep PRs focused -- one component or feature per PR when possible.
