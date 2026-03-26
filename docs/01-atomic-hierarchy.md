# Atomic Design Hierarchy for Angular + PrimeNG

> **When to read:** First. This is the foundation everything else builds on. Read time: ~10 minutes.

Atomic Design (Brad Frost, 2013) decomposes UIs into five distinct levels.
This document defines each level in the context of **Angular 21** and **PrimeNG 21**, establishing what belongs where and why.

## Level 1 -- Atoms

Thin wrappers around a single PrimeNG primitive or native HTML element. They apply design tokens (spacing, color, typography) and expose a minimal API. They contain **no business logic**.

**PrimeNG classification heuristic:** If a PrimeNG component has its own internal templating system (`pTemplate`), built-in state management, or renders outside the component tree (overlays), treat it as an **organism-level primitive**, not an atom.

### Simple atoms -- thin wrappers around PrimeNG

| Atom | PrimeNG / HTML | Purpose |
|------|----------------|---------|
| Button | `p-button` | Action trigger with consistent theme |
| Input | `p-inputtext` | Single-line text entry |
| Label | native `<label>` | Accessible form labeling |
| Badge | `p-badge` | Numeric or status indicator |
| Icon | PrimeIcons | Iconography via design-token sizing |
| Avatar | `p-avatar` | User or entity image/initials |
| Checkbox | `p-checkbox` | Boolean toggle |
| Tag | `p-tag` | Categorical label with severity color |
| Tooltip | `p-tooltip` | Contextual hint on hover/focus |
| Divider | `p-divider` | Visual separator between sections |
| Link | native `<a>` / `routerLink` | Styled navigation anchor |
| Toggle | `p-toggleswitch` | On/off binary control |
| Empty State | native HTML | Reusable empty state composition (icon + message + optional action button) |

> **Empty State note:** Unlike most atoms which wrap a PrimeNG primitive, Empty State is a custom atom built from native HTML. PrimeNG does not provide a built-in empty state component.

### Organism primitives -- configured at organism level, not decomposed

| Primitive | PrimeNG Component | Why organism-level |
|-----------|-------------------|--------------------|
| Table | `p-table` | `pTemplate` columns, pagination, sorting state |
| Tree | `p-tree` | Recursive node templates, selection state |
| Editor | `p-editor` | Rich-text internal state, toolbar templating |
| Calendar | `p-calendar` | Overlay rendering, complex date state |
| Dialog | `p-dialog` | Renders outside component tree, manages visibility state |

**Compound components:** Components like Dropdown/Select contain multiple interactive parts (trigger, overlay, option list) which blur the atom/molecule boundary. If PrimeNG provides it as one component, wrap it as one atom. Do not decompose PrimeNG internals.

**Severity type narrowing:** Many PrimeNG components use union-type severity props (e.g. `'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'`). A naive atom wrapper that declares `severity = input<string>()` will compile, but binding that `string` to the inner PrimeNG component will fail type-checking because PrimeNG expects the narrow union. Solution: declare the union type locally in the atom (`type Severity = 'success' | 'info' | 'warn' | 'danger' | ...`) or import it from PrimeNG's types. Do not widen to `string` just to silence the compiler — you lose the safety the union provides.

**Wrapper input depth:** An atom should not re-expose every input the underlying PrimeNG component offers. Expose only what the design system actually uses, not everything PrimeNG makes available. Start with the minimum inputs needed for the current screens. Add more inputs when a real use case requires them — not preemptively. A thin wrapper with three inputs is easier to maintain and review than one that proxies twenty inputs "just in case."

**Key principle:** Purely presentational. Styled through design tokens. No services, no subscriptions, no state.

---

## Level 2 -- Molecules

Small compositions of 2-4 atoms that function as a single, reusable unit. Each molecule defines its own signal-based API -- `input()` for data in, `output()` for events out (Angular 21+ defaults) -- so it can be dropped into any organism without modification.

| Molecule | Composition | Behavior |
|----------|-------------|----------|
| Search Bar | Input + Button | Emits search term on submit via `output()` |
| Form Field | Label + Input + Error | Validates and surfaces inline errors; value exposed as `input()` |
| Nav Item | Icon + Label + Badge | Emits click via `output()`; highlights active state with internal signal |
| Card Header | Avatar + Label + Tag | Displays entity identity and status; all data via `input()` |
| Stat Card | Label + Value + Icon | Renders a single KPI with trend icon; data via `input()` |

**Key principle:** Reusable across organisms. Molecules own local interaction logic (focus, validation, toggle) but never fetch data or manage global state.

---

## Level 3 -- Organisms

Complex, self-contained UI sections. This is the level where **real data enters** the component tree and where state management (signals, stores, services) begins. Organism primitives (Table, Tree, Dialog, etc.) are configured here.

| Organism | Composition | Data Needs |
|----------|-------------|------------|
| Header / Navbar | Nav Items + Avatar + Search Bar | Auth user, notifications |
| Data Table | `p-table` (organism primitive) + Form Fields + Buttons | Paginated entity list |
| Sidebar Nav | Nav Items + section Labels | Route config, permissions |
| Card Grid | Stat Cards + Card Headers | Aggregated metrics |
| Form Section | Form Fields + Buttons + validation | Entity model, schema |

**Key principle:** Organisms inject services and manage state. They are the boundary between "dumb UI" (atoms/molecules) and "smart features."

**State requirement:** Every organism must handle at least four states: loading, error, empty, and data. Organisms sit at the boundary between UI and data -- they are responsible for gracefully handling all states the data source can produce. Additional states may emerge during implementation (e.g., search-no-results, partial failure).

---

## Level 4 -- Templates

Page-level layout shells built with **`ng-content` projection**. Templates define spatial structure (grid areas, responsive breakpoints) but render zero real data.

**Business logic vs. layout behavior logic:** Templates must contain no business logic (data fetching, domain rules, API calls). However, layout behavior logic is allowed -- for example a `collapsed` signal that controls whether a sidebar is expanded or collapsed. If the logic governs spatial arrangement, it belongs in the template.

| Template | Structure | Slots |
|----------|-----------|-------|
| Dashboard Layout | Top bar + sidebar + main grid | `header`, `sidebar`, `content` |
| Settings Layout | Left nav + right detail pane | `nav`, `detail` |
| Two-Column | Equal or weighted split | `left`, `right` |
| Full-Width | Single centered column | `content` |

**Key principle:** Data-free scaffolding. Named `ng-content` slots let pages project organisms without the template knowing what fills them.

---

## Level 5 -- Pages

Routed components that wire real data to templates and organisms. The **only** level that touches routing, guards, resolvers, and live API calls.

| Page | Route | Template | Key Organisms |
|------|-------|----------|---------------|
| Dashboard | `/dashboard` | Dashboard Layout | Card Grid, Data Table |
| User Settings | `/settings/user` | Settings Layout | Form Section |
| Search Results | `/search` | Two-Column | Data Table, Sidebar Nav |
| Detail View | `/entity/:id` | Full-Width | Card Header, Form Section |

**Key principle:** Pages orchestrate but do not render UI primitives directly. All visual output is delegated to organisms composed of molecules composed of atoms.

---

## The Cascade Rule

Each level consumes certified components from the level directly below for **structural composition**. Content projection follows a separate rule: pages consume templates as layout shells AND organisms as projected content.
```
Pages            (consume Templates as shells + Organisms as projected content)
  |
Templates        (define layout; receive projected content via ng-content slots)
  |
Organisms        (consume Molecules + Atoms + organism primitives)
  |
Molecules        (consume Atoms only)
  |
Atoms            (consume PrimeNG primitives + native HTML)
```
The strict one-level-below rule applies to structural composition, not content projection. A page projects an organism into a template slot -- this is not a cascade violation because the template does not depend on the organism; it simply provides the slot. An atom never imports a molecule. A molecule never imports an organism. A template never fetches data.

---

## Cross-References

- For QA criteria per level, see [07-qa-per-atomic-level.md](./07-qa-per-atomic-level.md).
- For how levels evolve across maturity stages, see [02-maturity-stages.md](./02-maturity-stages.md).

---

## See It in Code

This repo is a working prototype. Explore these files to see the hierarchy in practice:

- **Atom:** [`src/app/design-system/atoms/button/button.ts`](../src/app/design-system/atoms/button/button.ts) -- thin wrapper around PrimeNG p-button
- **Molecule:** [`src/app/design-system/molecules/search-bar/search-bar.ts`](../src/app/design-system/molecules/search-bar/search-bar.ts) -- composes DsInput + DsButton
- **Organism:** [`src/app/design-system/organisms/project-table/project-table.ts`](../src/app/design-system/organisms/project-table/project-table.ts) -- 5-state data-aware table
- **Page:** [`src/app/pages/dashboard/dashboard.ts`](../src/app/pages/dashboard/dashboard.ts) -- wires services to organisms
