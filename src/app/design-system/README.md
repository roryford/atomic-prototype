# Design System

Component library built using [Atomic Design](../../docs/01-atomic-hierarchy.md) principles.

## Structure

```
design-system/
  atoms/        — Thin wrappers around PrimeNG primitives (Button, Input, Tag, EmptyState)
  molecules/    — 2-4 atoms composed with local interaction logic (SearchBar, StatCard, FormField)
  organisms/    — Data-aware sections handling loading/error/empty/data states (StatGrid, ProjectCardGrid, ProjectTable, ProjectDetailCard)
  templates/    — Data-free layout shells with ng-content projection (DashboardLayout, FullWidthLayout)
  tokens/       — PrimeNG theme preset and design token definitions
```

## Cascade Rule

Each level imports only from the level below. Atoms import tokens. Molecules import atoms. Organisms import molecules and atoms. Pages import organisms (for structural composition) and templates (as layout shells to project those organisms into). Never import upward.

See [01-atomic-hierarchy](../../docs/01-atomic-hierarchy.md) for full definitions and [03-project-structure](../../docs/03-project-structure.md) for file conventions.

## Import Convention (barrels)

Each level ships a barrel (`atoms/index.ts`, `molecules/index.ts`, `organisms/index.ts`, `templates/index.ts`). These barrels are the **intended public entry point** for the level and the project deliberately keeps them.

- **Consumers** (pages, and code outside a given level) import from the barrel: `import { DsButton } from '../design-system/atoms';` — never reach into a component's deep path from outside its level.
- **Internal cross-level imports** (e.g. a molecule importing the atoms it composes, or an organism importing molecules/atoms) use **deep paths to the specific component** (`import { DsButton } from '../button/button';` / `'../../atoms/button/button'`), not the barrel. This keeps the dependency explicit, avoids pulling the whole level into a component, and sidesteps circular-barrel pitfalls.

This is an intentional, documented convention: barrels for outward-facing imports, deep paths for within/across-level composition. It is a convention, not lint-enforced — follow the existing usage when adding components.

## Template & Style Authoring Convention

The split between inline and external template/styles is intentional, chosen by component complexity:

- **Atoms, molecules, and templates** use **inline `template` and `styles`** in the `.ts` file, with plain CSS. These are small and benefit from being self-contained in one file.
- **Organisms** use **external `.html` and `.scss`** files and may use shared Sass mixins. Their markup (multi-state: loading/error/empty/data) and styling are large enough that external files and Sass composition keep them readable.

Rule of thumb: if a component is small and single-purpose, keep it inline with plain CSS; if it manages multiple render states or substantial layout, split it into external `.html` + `.scss`. Follow the convention of the level you are working in rather than mixing styles within a level.
