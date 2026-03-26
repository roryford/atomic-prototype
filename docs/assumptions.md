# Simulation Assumptions

> Decisions made during the prototype simulation that a real team should discuss in early alignment ([04-parallel-development](./04-parallel-development.md)).
> These become input for the real team's first conversation.

## Vocabulary

Confirmed atomic hierarchy per [01-atomic-hierarchy](./01-atomic-hierarchy.md). See that doc for full definitions.

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

1. **Selector prefix** — used `app-` (Angular default). [03-project-structure](./03-project-structure.md) suggests `ds-` for design system components at prototype stage. When to switch?
2. **Breakpoint values** — used 640/1024/1440 from design spec. [10-derisking](./10-derisking.md) mentions breakpoints but doesn't specify values. [07-qa-per-atomic-level](./07-qa-per-atomic-level.md)'s reference mentions 320/768/1024/1440/1920. Which is canonical?
3. **Dark mode strategy** — See [05-token-pipeline § Dark Mode](./05-token-pipeline.md#4-dark-mode) for the full guide. The prototype uses a manual toggle; the team should decide between manual, OS preference, or both.
4. **File naming convention** — Angular 21 uses 2025 naming (`button.ts`, class `Button`) not legacy (`button.component.ts`, class `ButtonComponent`). The docs use legacy naming throughout. Which should the team adopt?
5. **Atom wrapper depth** — [01-atomic-hierarchy](./01-atomic-hierarchy.md) says "thin wrapper" but doesn't specify: should the wrapper re-expose every PrimeNG input, or only the ones the design system uses?
