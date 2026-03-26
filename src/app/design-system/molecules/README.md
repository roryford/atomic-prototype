# Molecules

Compose 2-4 atoms with local interaction logic. Molecules add behavior (keyboard handling, two-way binding) that atoms don't have individually.

## Components

| Component | Composes | Key Behavior |
|-----------|----------|-------------|
| [DsSearchBar](./search-bar/search-bar.ts) | DsInput + DsButton | Enter key and button click both emit search term |
| [DsStatCard](./stat-card/stat-card.ts) | icon + value + label | Pure display, no interaction |
| [DsFormField](./form-field/form-field.ts) | label + ng-content | Layout wrapper for form inputs |

## When Is Something a Molecule?

If it composes atoms and adds simple local logic (no data fetching, no API calls), it's a molecule. If it needs to handle loading/error/empty states, it's an organism.

See [01-atomic-hierarchy § Level 2](../../docs/01-atomic-hierarchy.md) for the full molecule definition.
