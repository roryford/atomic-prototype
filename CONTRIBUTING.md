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
npm test
```

Tests use **Vitest** with **jsdom** as the DOM environment. Test files live alongside their components as `*.spec.ts`.

## Storybook

Always start Storybook through the Angular CLI wrapper:

```bash
npm run storybook
```

This runs `ng run atomic-prototype:storybook` under the hood. Do **not** run `storybook dev` directly -- it will bypass Angular's build pipeline and fail.

## Code Style

- **Prettier** for formatting (config: `.prettierrc`)
- **Stylelint** for SCSS linting (config: `.stylelintrc.json`)

Before committing:

```bash
npm run format
npm run lint:styles
```

## Design System

Components live in `src/app/design-system/` organized by atomic level:

```
src/app/design-system/
  atoms/          # Buttons, inputs, labels, icons
  molecules/      # Form fields, search bars, card headers
  organisms/      # Data tables, forms, dashboards
```

Each component gets its own folder containing:

- `component-name.ts` -- component logic and template
- `component-name.spec.ts` -- unit tests
- `component-name.stories.ts` -- Storybook stories

## PR Guidelines

- Include **unit tests** for all new components.
- Include **Storybook stories** for every design system component.
- Organisms must handle all four states: **loading**, **error**, **empty**, and **data**.
- Run `npm test` and `npm run format:check` before opening a PR.
- Keep PRs focused -- one component or feature per PR when possible.
