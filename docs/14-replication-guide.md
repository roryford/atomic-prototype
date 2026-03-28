# Replication Guide

> **Who is this for?** A developer (or small team) who wants to build a project like this from scratch, not fork this repo. Read time: ~25 minutes. Working time: 2-4 hours to reach a running app with one atom, one story, one test, and MSW mocking.

This guide walks through every step to replicate this prototype's architecture in a new Angular 21 + PrimeNG 21 project. Each section builds on the previous one. By the end, you will have a working atomic design system with Storybook, Vitest, and Mock Service Worker -- the same foundation this repo demonstrates.

For what the end state looks like, browse this prototype's `src/` directory alongside each section.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Scaffolding](#2-scaffolding)
3. [Adding PrimeNG](#3-adding-primeng)
4. [Project Structure](#4-project-structure)
5. [Your First Token](#5-your-first-token)
6. [Your First Atom](#6-your-first-atom)
7. [Your First Story](#7-your-first-story)
8. [Your First Test](#8-your-first-test)
9. [Adding MSW for API Mocking](#9-adding-msw-for-api-mocking)
10. [First Sprint Checklist](#10-first-sprint-checklist)
11. [What to Skip at POC Stage](#11-what-to-skip-at-poc-stage)

---

## 1. Prerequisites

You need exact version alignment. Angular 21 requires Node 25+.

| Tool | Version | How to verify |
|------|---------|---------------|
| Node.js | >= 25.0.0 | `node -v` |
| npm | >= 11.11.0 | `npm -v` |
| Angular CLI | ^21.2.3 | `npx @angular/cli version` |

Install Node 25 via [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 25
nvm use 25
```

Lock the version for your team by creating `.nvmrc` at the project root:

```
25
```

Install the Angular CLI globally (optional but convenient):

```bash
npm install -g @angular/cli@21
```

---

## 2. Scaffolding

Run the Angular CLI with these flags:

```bash
ng new my-project --style=scss --routing --ssr=false
```

When prompted, select the defaults. The flags explained:

| Flag | Why |
|------|-----|
| `--style=scss` | PrimeNG theming and design tokens work best with SCSS. Token variables, mixins, and the `color-no-hex` stylelint rule all assume SCSS. |
| `--routing` | You need `provideRouter(routes)` from day one. Lazy-loaded pages are how you keep the initial bundle small. |
| `--ssr=false` | Server-side rendering adds complexity that a 2-4 person team does not need at POC or prototype stage. Add it later if SEO or first-paint performance demands it. |

Angular 21 generates standalone components by default. There is no `--standalone` flag because standalone is now the only mode.

After scaffolding, create `.npmrc` at the project root:

```
legacy-peer-deps=true
```

This is required because Storybook 10's peer dependency declarations lag behind Angular 21. Without it, `npm install` will fail when you add Storybook later.

Lock the package manager version in `package.json`:

```json
{
  "packageManager": "npm@11.11.0",
  "engines": {
    "node": ">=25.0.0"
  }
}
```

Verify the scaffold works:

```bash
cd my-project
npm start
```

You should see the Angular welcome page at `http://localhost:4200`.

---

## 3. Adding PrimeNG

Install PrimeNG and its theme system:

```bash
npm install primeng@21 @primeng/themes@21 primeicons@7
```

Install animations support (PrimeNG components need this):

```bash
npm install @angular/animations@21
```

### Configure `app.config.ts`

Replace the generated `app.config.ts` with the PrimeNG provider setup:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: undefined, // You will replace this in the next section
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
  ],
};
```

Key decisions:

- **`provideAnimationsAsync()`** -- Lazy-loads animations. Use `Async` to avoid blocking the initial bundle.
- **`provideHttpClient()`** -- Needed by pages that fetch data. Add it now to avoid a confusing "no provider" error later.
- **`providePrimeNG()`** -- Registers the theme globally. The `preset` will point to your custom token file.
- **`darkModeSelector: '.dark-mode'`** -- Opt-in dark mode via a CSS class toggle. Not needed at POC stage, but declaring the selector now means you do not have to reconfigure later.

### Add PrimeIcons to `angular.json`

In `angular.json`, add PrimeIcons to the styles array:

```json
"styles": [
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
]
```

### Verify

Drop a PrimeNG button into your root component to confirm the setup works:

```typescript
import { Button } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [Button],
  template: `<p-button label="It works" />`,
})
export class App {}
```

Run `npm start` and confirm the button renders with PrimeNG styling.

---

## 4. Project Structure

Create the atomic design directory hierarchy:

```bash
mkdir -p src/app/design-system/tokens
mkdir -p src/app/design-system/atoms
mkdir -p src/app/design-system/molecules
mkdir -p src/app/design-system/organisms
mkdir -p src/app/design-system/templates
mkdir -p src/app/pages
mkdir -p src/app/models
mkdir -p src/app/services
mkdir -p src/app/mocks/fixtures
```

Create barrel exports (`index.ts`) at each level:

```bash
touch src/app/design-system/tokens/index.ts
touch src/app/design-system/atoms/index.ts
touch src/app/design-system/molecules/index.ts
touch src/app/design-system/organisms/index.ts
touch src/app/design-system/templates/index.ts
```

Each barrel file starts empty and grows as you add components. For example, `atoms/index.ts` will eventually contain:

```typescript
export { DsButton } from './button/button';
```

For the full directory tree at each maturity stage, see [03-project-structure.md](./03-project-structure.md).

---

## 5. Your First Token

Create `src/app/design-system/tokens/preset.ts`:

```typescript
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const CustomPreset = definePreset(Aura, {
  // Primitive tier: raw palette values
  primitive: {
    indigo: {
      500: '#4338CA',
      400: '#6366F1',
      600: '#3730A3',
    },
  },

  // Semantic tier: intent-based aliases
  semantic: {
    colorScheme: {
      light: {
        primary: {
          color: '#4338CA',
          contrastColor: '#FFFFFF',
          hoverColor: '#6366F1',
          activeColor: '#3730A3',
        },
      },
    },
  },
});

export default CustomPreset;
```

This is intentionally minimal. You define one primitive color (indigo) and one semantic alias (primary). The Aura base theme provides sensible defaults for everything else.

The three-tier model:

| Tier | What it holds | Example |
|------|--------------|---------|
| **Primitive** | Raw color values, border radii | `indigo.500: '#4338CA'` |
| **Semantic** | Intent-based aliases that reference primitives | `primary.color: '#4338CA'` |
| **Component** | Structural overrides (padding, radius, font weight) | `button.root.borderRadius: '6px'` |

Export it from the barrel:

```typescript
// src/app/design-system/tokens/index.ts
export { default as CustomPreset } from './preset';
```

### Wire it into `app.config.ts`

Replace the `preset: undefined` placeholder:

```typescript
import { CustomPreset } from './design-system/tokens';

// In the providePrimeNG call:
providePrimeNG({
  theme: {
    preset: CustomPreset,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
}),
```

### Verify

Run `npm start`. The PrimeNG button you added earlier should now render in your indigo brand color instead of the default Aura blue. If it does, your token pipeline is working.

---

## 6. Your First Atom

Atoms are thin wrappers around PrimeNG primitives. They exist to isolate consumers from the PrimeNG API surface, enforce design constraints, and make it possible to swap the underlying library without touching every consumer.

Create `src/app/design-system/atoms/button/button.ts`:

```typescript
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

type ButtonSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'help'
  | 'primary'
  | 'secondary'
  | 'contrast';

@Component({
  selector: 'ds-button',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-button
      [label]="label()"
      [severity]="severity()"
      [outlined]="outlined()"
      (onClick)="clicked.emit()"
    />
  `,
})
export class DsButton {
  label = input<string>();
  severity = input<ButtonSeverity>('primary');
  outlined = input(false);
  clicked = output<void>();
}
```

Key patterns to follow:

- **`ds-` prefix** -- All design system components use the `ds-` selector prefix. This makes them instantly recognizable in templates.
- **Signal-based inputs** -- Angular 21 uses `input()` and `output()` instead of `@Input()` and `@Output()`. Use them from the start.
- **`OnPush` change detection** -- Every component. No exceptions.
- **Inline template** -- Atoms and molecules use inline templates because they are small. Organisms and above use separate `.html` files.
- **Narrow API surface** -- Expose only the inputs the design system uses. PrimeNG's `p-button` has dozens of inputs (icon, size, loading, badge, etc.). Expose them only when the design system scope expands.

Export from the barrel:

```typescript
// src/app/design-system/atoms/index.ts
export { DsButton } from './button/button';
```

### Verify

Use the atom in your root component:

```typescript
import { DsButton } from './design-system/atoms';

@Component({
  selector: 'app-root',
  imports: [DsButton],
  template: `<ds-button label="Hello Atom" />`,
})
export class App {}
```

Run `npm start`. You should see a styled button labeled "Hello Atom".

---

## 7. Your First Story

### Install Storybook

The Storybook Angular CLI integration handles most of the setup:

```bash
npx storybook@latest init --type angular
```

This creates the `.storybook/` directory with `main.ts` and `preview.ts`, adds the `storybook` and `build-storybook` targets to `angular.json`, and installs dependencies.

### Configure `.storybook/preview.ts` for PrimeNG

Storybook runs outside the normal Angular bootstrap, so it does not pick up your `app.config.ts` providers. You must replicate the PrimeNG configuration in the Storybook preview:

```typescript
import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import CustomPreset from '../src/app/design-system/tokens/preset';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        providePrimeNG({
          theme: {
            preset: CustomPreset,
            options: { darkModeSelector: '.dark-mode' },
          },
        }),
      ],
    }),
  ],
};

export default preview;
```

### Create the story

Create `src/app/design-system/atoms/button/button.stories.ts`:

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { DsButton } from './button';

const meta: Meta<DsButton> = {
  title: 'Design System/Atoms/Button',
  component: DsButton,
  argTypes: {
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'info', 'warn', 'help', 'contrast'],
    },
  },
};
export default meta;
type Story = StoryObj<DsButton>;

export const Primary: Story = {
  args: { label: 'Primary Button', severity: 'primary' },
};

export const Outlined: Story = {
  args: { label: 'Outlined', severity: 'primary', outlined: true },
};
```

The `title` field controls the sidebar grouping. Use `Design System/Atoms/...`, `Design System/Molecules/...`, etc. to mirror the atomic hierarchy.

### Add npm scripts

If the Storybook init did not add them, add these to `package.json`:

```json
{
  "scripts": {
    "storybook": "ng run my-project:storybook",
    "build-storybook": "ng run my-project:build-storybook"
  }
}
```

### Run it

```bash
npm run storybook
```

Storybook opens at `http://localhost:6006`. Navigate to **Design System > Atoms > Button** in the sidebar. You should see your button rendering with the PrimeNG theme and your custom tokens. Use the Controls panel to toggle severity and outlined state.

---

## 8. Your First Test

Angular 21 ships with a built-in Vitest integration via `@angular/build:unit-test`.

### Configure the test target

In `angular.json`, add (or verify) the test target:

```json
"test": {
  "builder": "@angular/build:unit-test",
  "options": {
    "buildTarget": "my-project:build",
    "tsConfig": "tsconfig.spec.json"
  }
}
```

Install the test dependencies if not already present:

```bash
npm install -D vitest jsdom
```

### Create the test

Create `src/app/design-system/atoms/button/button.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsButton } from './button';

describe('DsButton', () => {
  let fixture: ComponentFixture<DsButton>;
  let component: DsButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsButton],
    }).compileComponents();
    fixture = TestBed.createComponent(DsButton);
    component = fixture.componentInstance;
  });

  it('should render with default primary severity', () => {
    fixture.detectChanges();
    const pButton = fixture.nativeElement.querySelector('p-button');
    expect(pButton).toBeTruthy();
    expect(component.severity()).toBe('primary');
  });

  it('should render with provided label', () => {
    fixture.componentRef.setInput('label', 'Click Me');
    fixture.detectChanges();
    expect(component.label()).toBe('Click Me');
  });

  it('should support outlined variant', () => {
    fixture.componentRef.setInput('outlined', true);
    fixture.detectChanges();
    expect(component.outlined()).toBe(true);
  });

  // PrimeNG's p-button (onClick) doesn't fire via DOM click dispatch in jsdom.
  // This test verifies the output exists and can emit. Full click-through
  // testing requires Storybook play functions or Playwright.
  it('should expose clicked output', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.clicked.emit();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
```

### Run it

```bash
npm test
```

### The PrimeNG jsdom limitation

PrimeNG components render to the real DOM using browser APIs that jsdom does not fully implement. This means:

- **You can test component inputs, outputs, and state** -- these work fine.
- **You cannot test PrimeNG's internal DOM behavior** -- click events on `p-button`, dropdown selections, table sorting, etc. will not fire correctly in jsdom.
- **Use Storybook play functions or Playwright E2E tests** for interaction testing.

This is not a Vitest problem. It affects any jsdom-based test runner (Jest, Vitest, Web Test Runner in jsdom mode). The workaround is to test your wrapper's API (inputs in, outputs out) in unit tests and test PrimeNG interactions in the browser via Storybook or Playwright.

---

## 9. Adding MSW for API Mocking

[Mock Service Worker](https://mswjs.io/) intercepts HTTP requests at the service worker level. This means your Angular services, PrimeNG components, and browser dev tools all see realistic API responses without a running backend.

### Install MSW

```bash
npm install -D msw
npx msw init src --save
```

The `init` command copies `mockServiceWorker.js` into `src/`. The `--save` flag adds the worker directory to `package.json`:

```json
{
  "msw": {
    "workerDirectory": ["src"]
  }
}
```

### Register the service worker as a build asset

In `angular.json`, add the service worker to the assets array:

```json
"assets": [
  { "glob": "**/*", "input": "public" },
  { "glob": "mockServiceWorker.js", "input": "src" }
]
```

### Create handlers

Create `src/app/mocks/handlers.ts`:

```typescript
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  http.get('/api/projects', async () => {
    await delay(300);
    return HttpResponse.json([
      { id: 1, name: 'Project Alpha', status: 'active' },
      { id: 2, name: 'Project Beta', status: 'draft' },
    ]);
  }),
];
```

Create `src/app/mocks/browser.ts`:

```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

### Gate behind `isDevMode()`

Modify `src/main.ts` to start MSW only in development:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { isDevMode } from '@angular/core';

async function bootstrap() {
  if (isDevMode()) {
    const { worker } = await import('./app/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  await bootstrapApplication(App, appConfig);
}

bootstrap().catch((err) => console.error(err));
```

Key points:

- **Dynamic import** -- `import('./app/mocks/browser')` is only loaded in dev mode. The mock handlers and MSW runtime are tree-shaken from production builds.
- **`onUnhandledRequest: 'bypass'`** -- Requests without a matching handler (e.g., PrimeNG asset loads) pass through silently.
- **`isDevMode()`** -- Angular's built-in check. Returns `false` in production builds.

### Use realistic fixture data

As handlers grow, move response data into JSON fixtures:

```
src/app/mocks/fixtures/
  projects.json
  stats.json
```

Import them in your handlers:

```typescript
import projects from './fixtures/projects.json';

http.get('/api/projects', async () => {
  await delay(300);
  return HttpResponse.json(projects);
});
```

### Verify

Run `npm start`, open the browser console. You should see `[MSW] Mocking enabled.` Open the Network tab and navigate to a page that calls `/api/projects`. The response should contain your fixture data, served by the service worker.

---

## 10. First Sprint Checklist

What a 2-4 person team should accomplish in week 1, assuming the scaffolding above is already done.

### Days 1-2: Foundation

- [ ] Scaffold the project (sections 1-5 of this guide)
- [ ] Set up ESLint with `angular-eslint` and Prettier
- [ ] Define the full color palette in `preset.ts` (primitives + semantic)
- [ ] Build 2-3 atoms: DsButton, DsInput, DsTag

### Days 3-4: Composition

- [ ] Build 1-2 molecules: DsSearchBar (DsInput + DsButton), DsStatCard (DsTag + layout)
- [ ] Set up MSW with handlers for your first API endpoint
- [ ] Write Storybook stories for all atoms and molecules
- [ ] Write Vitest specs for all atoms and molecules

### Day 5: Integration

- [ ] Build one page that composes molecules into a layout
- [ ] Set up routing with lazy-loaded pages
- [ ] Team demo and retrospective

### Why this order

Components must be built bottom-up because of the dependency chain:

```
Tokens -> Atoms -> Molecules -> Organisms -> Pages
```

You cannot build a molecule before its atoms exist. You cannot build an organism before its molecules exist. The dependency ordering forces a natural build sequence:

1. **Atoms first** -- They depend only on tokens and PrimeNG primitives. No blocking dependencies.
2. **Molecules second** -- They compose atoms. Building them surfaces missing atom inputs early.
3. **Organisms third** -- They compose molecules and often need data. This is when MSW becomes essential.
4. **Pages last** -- They wire organisms to routes and services. By this point the building blocks exist.

Build DsButton first because it is the most reused atom. Build DsInput second because search and forms need it. Build DsTag third because status displays need it. These three atoms unlock most molecules.

---

## 11. What to Skip at POC Stage

Not everything in this prototype is needed from day one. The following are explicitly deferred until the prototype or production stage. Do not spend time on them during the POC.

| Skip this | Why | When to add |
|-----------|-----|-------------|
| **Dark mode** | The `darkModeSelector` is configured but unused. Focus on one color scheme first. | Prototype stage, after the semantic color scheme is stable. |
| **E2E tests (Playwright)** | Integration tests are expensive to write and maintain. Unit tests and Storybook cover POC needs. | Prototype stage, once page flows stabilize. |
| **CI pipeline** | Nothing to gate. The POC never ships to users. | Prototype stage, when the team is merging PRs. |
| **Visual regression testing** | Requires a stable component library to compare against. Meaningless when components change daily. | Production stage, after the design system is frozen. |
| **Accessibility automation (axe-core in CI)** | Important, but the POC goal is proving feasibility, not compliance. | Prototype stage. Add `@storybook/addon-a11y` early for manual checks. |
| **Style Dictionary / DTCG tokens** | The `definePreset()` approach works without a build step. A formal token pipeline adds complexity. | Production stage, when design-dev handoff needs automation. |
| **Nx monorepo** | A single Angular project is simpler for a team of 2-4. Nx overhead is not justified by one consuming application. | Only when a second application needs to consume the design system. |
| **Custom schematics / generators** | Copy-paste from an existing atom folder is fast enough for 10-15 components. | Production stage, if the component count grows beyond 30+. |
| **Performance budgets in CI** | Budgets are defined in `angular.json` and enforced at build time. CI enforcement can wait. | Production stage, when bundle size discipline matters. |

For the full maturity model (what is expected at POC, Prototype, and Production stages), see [02-maturity-stages.md](./02-maturity-stages.md).

---

## What the End State Looks Like

This prototype repository is the end state of following this guide through to the prototype maturity level. Browse these files to see the completed versions of everything described above:

| What | File |
|------|------|
| Token preset (full) | `src/app/design-system/tokens/preset.ts` |
| App config | `src/app/app.config.ts` |
| First atom | `src/app/design-system/atoms/button/button.ts` |
| First test | `src/app/design-system/atoms/button/button.spec.ts` |
| First story | `src/app/design-system/atoms/button/button.stories.ts` |
| Barrel exports | `src/app/design-system/atoms/index.ts` |
| Storybook config | `.storybook/main.ts`, `.storybook/preview.ts` |
| MSW handlers | `src/app/mocks/handlers.ts` |
| MSW bootstrap | `src/main.ts` |
| Routing | `src/app/app.routes.ts` |
| Full project structure | [03-project-structure.md](./03-project-structure.md) |
