# Templates

Page-level layout shells (Level 4). Templates define spatial structure — padding,
grid areas, column widths, header bars — and project content through named
`ng-content` slots. They render **zero real data** and contain **no business
logic** (no fetching, no domain rules). Layout behavior logic (e.g. a `maxWidth`
input, a future `collapsed` sidebar signal) is allowed because it governs spatial
arrangement, not domain state.

## Components

| Component | Structure | Slots |
|-----------|-----------|-------|
| [DsDashboardLayout](./dashboard-layout/dashboard-layout.ts) | Full-height padded surface; header bar above a stacked content region | `[header]`, default |
| [DsFullWidthLayout](./full-width-layout/full-width-layout.ts) | Centered single column; `maxWidth` controls width, optional `title` heading | default |

Additional documented shells (Settings Layout, Two-Column) are deferred until a
real screen needs them — see the "minimum inputs needed" principle in
[01-atomic-hierarchy](../../../docs/01-atomic-hierarchy.md).

## Key Pattern

A page consumes a template as a layout shell and projects organisms into its
slots. The template never imports or depends on the organisms it holds — it only
provides the slot. This is content projection, not a cascade violation: a page
may project an organism into a template even though both sit above the template
in the hierarchy.

```html
<!-- page -->
<ds-dashboard-layout>
  <div header>…title + actions…</div>
  <ds-stat-grid … />      <!-- projected organism -->
  <ds-project-card-grid … />
</ds-dashboard-layout>
```

See [01-atomic-hierarchy § Level 4](../../../docs/01-atomic-hierarchy.md) for the
full template definition.
