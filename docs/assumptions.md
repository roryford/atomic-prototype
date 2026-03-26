# Simulation Assumptions

> Decisions Claude made autonomously that a real team would discuss in Week 1 alignment ([05-parallel-development](./05-parallel-development.md)).
> These become input for the real team's first conversation.

## Vocabulary ([01-atomic-hierarchy](./01-atomic-hierarchy.md))

Confirmed atomic hierarchy per [01-atomic-hierarchy](./01-atomic-hierarchy.md):
- **Atom** = thin wrapper around a single PrimeNG primitive (Button, Input, Tag, etc.)
- **Molecule** = 2-4 atoms composed with local interaction logic (Search Bar, Stat Card, etc.)
- **Organism** = complex, data-aware section (Data Table, Card Grid, Form Section)
- **Organism primitive** = PrimeNG components too complex to decompose (Table, Dialog, Calendar) — configured at organism level
- **Template** = layout shell with `ng-content` projection, zero business logic
- **Page** = routed component wiring real/hardcoded data to templates + organisms

## PrimeNG Fit

Decision deferred to Spike 1 (Wave 3). Will validate by attempting to replicate design-spec.md component targets using only `definePreset()`.

## Responsive Approach

**Decision: Reflow** (CSS Grid adjustments at breakpoints, same DOM structure).

**Rationale:** All three POC screens (Dashboard, List, Detail) are standard layouts. Dashboard cards reflow from 4-col to 1-col. List table gets horizontal scroll on mobile. Detail form stacks fields vertically. None require different DOM for mobile vs desktop.

**Deferred for real team:** Whether any future screens (e.g., complex dashboards with drag-and-drop) would need restructure instead of reflow.

## Settled vs Moving

For this simulation, everything is **settled** — we're building from a fixed design spec.

In a real project, the team should maintain a visible list:
```
Settled:     [safe to build to production quality]
In progress: [expect tweaks, build to prototype quality]
Exploring:   [being tested, POC quality at most]
Not started: [not ready yet]
```

## Deferred Questions for Real Team

These decisions were made unilaterally for the simulation. A real team should discuss:

1. **Selector prefix** — used `app-` (Angular default). [08-project-structure](./08-project-structure.md) suggests `ds-` for design system components at prototype stage. When to switch?
2. **Breakpoint values** — used 640/1024/1440 from design spec. [07-derisking](./07-derisking.md) mentions breakpoints but doesn't specify values. [04-qa-per-atomic-level](./04-qa-per-atomic-level.md)'s reference mentions 320/768/1024/1440/1920. Which is canonical?
3. **Dark mode strategy** — [08-project-structure](./08-project-structure.md) shows `darkModeSelector: '.dark-mode'` but doesn't explain where the class toggle lives. OS preference media query? Manual toggle? Both?
4. **File naming convention** — Angular 21 uses 2025 naming (`button.ts`, class `Button`) not legacy (`button.component.ts`, class `ButtonComponent`). The docs use legacy naming throughout. Which should the team adopt?
5. **Atom wrapper depth** — [01-atomic-hierarchy](./01-atomic-hierarchy.md) says "thin wrapper" but doesn't specify: should the wrapper re-expose every PrimeNG input, or only the ones the design system uses?
