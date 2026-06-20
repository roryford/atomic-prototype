# Atoms

Thin wrappers around a single PrimeNG primitive. Each atom exposes only the inputs the design system uses — PrimeNG's full API is intentionally hidden.

## Components

| Component | Wraps | Key Inputs |
|-----------|-------|------------|
| [DsButton](./button/button.ts) | p-button | label, severity, outlined |
| [DsInput](./input/input.ts) | pInputText | placeholder, value (model) |
| [DsTag](./tag/tag.ts) | p-tag | value, severity |
| [DsEmptyState](./empty-state/empty-state.ts) | native HTML + DsButton | icon, message, actionLabel |

## Why Wrap?

Isolates consumers from PrimeNG API changes, enforces design constraints, and makes it possible to swap the underlying library without touching every consumer.

## Conventions

**Icons.** There is no `DsIcon` atom. Icons are rendered inline with PrimeIcons `pi` classes (e.g. `<i class="pi pi-inbox" aria-hidden="true"></i>`); decorative icons carry `aria-hidden="true"` and icon names are passed via inputs where configurable (see `DsEmptyState`'s `icon`).

**Empty State composes Button.** Atoms normally wrap a single primitive and do not import other atoms. `DsEmptyState` is a deliberate, documented exception: its optional action reuses the `DsButton` atom instead of duplicating button markup. See [01-atomic-hierarchy § Level 1](../../../docs/01-atomic-hierarchy.md) for the rationale.

**Authoring style.** Atoms use inline `template` + `styles` with plain CSS (see [design-system README](../README.md#template--style-authoring-convention)).

See [01-atomic-hierarchy § Level 1](../../docs/01-atomic-hierarchy.md) for the full atom definition.
