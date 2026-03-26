# Atoms

Thin wrappers around a single PrimeNG primitive. Each atom exposes only the inputs the design system uses — PrimeNG's full API is intentionally hidden.

## Components

| Component | Wraps | Key Inputs |
|-----------|-------|------------|
| [DsButton](./button/button.ts) | p-button | label, severity, outlined |
| [DsInput](./input/input.ts) | pInputText | placeholder, value (model) |
| [DsTag](./tag/tag.ts) | p-tag | value, severity |
| [DsEmptyState](./empty-state/empty-state.ts) | — (custom) | icon, message, actionLabel |

## Why Wrap?

Isolates consumers from PrimeNG API changes, enforces design constraints, and makes it possible to swap the underlying library without touching every consumer.

See [01-atomic-hierarchy § Level 1](../../docs/01-atomic-hierarchy.md) for the full atom definition.
