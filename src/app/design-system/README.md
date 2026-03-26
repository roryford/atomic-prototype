# Design System

Component library built using [Atomic Design](../../docs/01-atomic-hierarchy.md) principles.

## Structure

```
design-system/
  atoms/        — Thin wrappers around PrimeNG primitives (Button, Input, Tag, EmptyState)
  molecules/    — 2-4 atoms composed with local interaction logic (SearchBar, StatCard, FormField)
  organisms/    — Data-aware sections handling loading/error/empty/data states (StatGrid, ProjectCardGrid, ProjectTable)
  templates/    — Layout shells with ng-content projection (empty — deferred to production)
  tokens/       — PrimeNG theme preset and design token definitions
```

## Cascade Rule

Each level imports only from the level below. Atoms import tokens. Molecules import atoms. Organisms import molecules and atoms. Pages import organisms. Never import upward.

See [01-atomic-hierarchy](../../docs/01-atomic-hierarchy.md) for full definitions and [03-project-structure](../../docs/03-project-structure.md) for file conventions.
