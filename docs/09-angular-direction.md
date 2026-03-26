# 09 - Angular Direction: Things to Be Aware Of

> **When to read:** When you need to understand Angular 21 features that affect component architecture. Not needed before your first component. Read time: ~10 minutes.

> A reference for Angular features and ecosystem signals that affect our atomic
> design approach. Honest about what is stable vs speculative. Not urgent
> decisions -- awareness and readiness.

---

## Feature Status Table (March 2026)

| Feature | Status | Use Now? | Impact on Atomic Design |
|---|---|---|---|
| Signal inputs/outputs | **Stable** | Yes | Simpler, type-safe atom APIs |
| Zoneless change detection | **Stable** | Yes | Performance by default |
| `toSignal()` / `toObservable()` | **Stable** | Yes | Clean Observable interop at service boundaries |
| `@defer` blocks | **Stable** | Yes | Lazy-load heavy organisms within pages |
| Signal equality functions | **Stable** | Yes | Correct change detection for object/array signals |
| CDK a11y primitives | **Stable** | Yes, for custom atoms | A11y-guaranteed custom components |
| `linkedSignal()` | **Stable** | Yes | Writable signals that reset when upstream changes |
| Selectorless components | **RFC/Preview** | Plan for, don't depend on | Lighter atom wrappers in future |
| Signal Forms | **Developer Preview** | Abstract for later swap | Simpler form molecules when stable |
| Headless component library | **Speculative** | Watch, don't build on | Potential alternative to PrimeNG for custom atoms |
| Angular CLI MCP | **Experimental** | Try if available | AI-assisted code generation |
| PrimeNgX | **Announced, no date** | Wrappers protect you | Swap internals when available |

---

## Signal-First Architecture (Stable)

`input()`, `output()`, and `model()` replace decorator-based equivalents.
Signals are the primary reactivity primitive. All signal primitives are available
at every atomic level; the table below shows where each is **dominant**.

### Dominant Signal Usage Per Level

| Level | Dominant Primitive | Why |
|---|---|---|
| **Atoms** | `input()`, `output()`, `model()` | Define the component's public API surface |
| **Molecules** | `computed()` | Derive state from multiple atom signals declaratively |
| **Organisms** | `effect()`, `linkedSignal()` | Coordinate complex cross-cutting state (filter + sort + paginate) |
| **Templates** | _(composition only)_ | Arrange organisms; no new signal surface |
| **Pages** | Signal-based services | Route-level state in injectable signal stores |

### `linkedSignal()` Explained

A writable signal whose value resets when an upstream signal changes. Common in
organisms where a selection should clear when the underlying data refreshes.

```typescript
// Selected row resets to null whenever tableData changes
tableData = input.required<Row[]>();
selectedRow = linkedSignal<Row | null>(() => {
  this.tableData(); // track upstream
  return null;       // reset value
});
```

### `toSignal()` / `toObservable()` Bridge Utilities (Stable)

These bridge signals and Observables at service boundaries. Use `toSignal()` to
consume HTTP responses or NgRx selectors as signals. Use `toObservable()` when
passing signal state to Observable-based APIs.

```typescript
// Service returns Observable; component consumes as signal
users = toSignal(this.userService.getUsers(), { initialValue: [] });

// Signal state fed into an Observable pipeline
searchTerm = signal('');
results = toSignal(
  toObservable(this.searchTerm).pipe(
    debounceTime(300),
    switchMap(term => this.api.search(term))
  ),
  { initialValue: [] }
);
```

### Signal Equality Functions

By default, signals use referential equality. HTTP responses return new object
references every time. Provide a custom equality function to prevent unnecessary
re-renders.

```typescript
users = signal<User[]>([], { equal: (a, b) => JSON.stringify(a) === JSON.stringify(b) });
```

For fine-grained control, use field-level comparison or a library like
`fast-deep-equal`. Apply this especially to signals holding API response data
in organisms and page-level services.

**`httpResource()` (Experimental 19.2):** Signal-based HTTP resource from `@angular/common/http`. For usage patterns, template examples, and MSW integration, see [11-implementation-tips](./11-implementation-tips.md).

**What to do now:** Use signal inputs/outputs for all new atoms. Use
`computed()` in molecules, `linkedSignal()` in organisms where state resets on
upstream change, and `toSignal()` at service boundaries.

---

## Zoneless Change Detection (Stable)

Zone.js is removed. Change detection fires only when a signal is written to.
OnPush-like behavior is the default.

> **Note:** In Angular 21, zoneless change detection is the default. `provideZonelessChangeDetection()` is no longer needed in `app.config.ts`. The framework also generates `provideBrowserGlobalErrorListeners()` as a new default provider.

> **Note:** OnPush as the explicit default strategy in v22 is the expected
> direction but not confirmed at time of writing. In practice, zoneless already
> provides equivalent granular re-rendering.

- **Atoms with signals "just work"** -- a signal write triggers re-render of
  exactly the components that read it.
- **Performance by default** -- every level benefits from granular re-rendering
  without configuration.
- **Storybook faster** -- no Zone.js overhead in stories.
- **PrimeNG v21 already supports zoneless** -- no compatibility friction.

**What to do now:** Build zoneless from day one. No action required beyond using
signal-based components.

---

## `@defer` Blocks for Lazy Loading (Stable)

`@defer` enables declarative lazy loading of component subtrees. Particularly
valuable for heavy organisms within pages.

```html
<!-- page template: lazy-load a data-heavy organism -->
@defer (on viewport) {
  <app-analytics-organism />
} @placeholder {
  <app-skeleton-loader />
} @error {
  <app-error-fallback message="Analytics unavailable" />
}
```

**Impact on atomic design:** Pages and templates can defer-load organisms that
are expensive to initialize (large tables, charts, maps) without custom lazy
module wiring. Keeps initial page load fast.

**What to do now:** Use `@defer` for any organism that is below the fold or
conditionally displayed.

---

## Error Handling Patterns

Angular does not have React-style error boundaries. Use a layered approach:

| Layer | Mechanism | Scope |
|---|---|---|
| Global | `ErrorHandler` service override | Catch-all logging and reporting |
| Organism | `catchError` in Observable pipelines / try-catch in `effect()` | Graceful degradation per feature area |
| Template | `@defer @error` block, conditional fallback UI | User-facing feedback |

```typescript
// Organism-level: catch and show fallback
loadError = signal(false);

data = toSignal(
  this.service.getData().pipe(
    catchError(() => {
      this.loadError.set(true);
      return of([]);
    })
  ),
  { initialValue: [] }
);
```

**What to do now:** Register a global `ErrorHandler` early. Design organism
atoms to expose an error/fallback state. Use `@defer @error` in templates.

---

## Future / Watch List

These features are announced but not stable. Track them but do not build on them.

## Selectorless Components (RFC/Preview)

Components referenced by class name directly in templates. The `selector` string
is dropped.

```typescript
// Future syntax (may change):
@Component({ template: `<button [class]="variant()"><ng-content /></button>` })
export class ButtonAtom { ... }

// Usage in molecule template:
// <ButtonAtom variant="primary">Search</ButtonAtom>
```

**Impact:** Eliminates `app-` prefix conventions, enables IDE-driven refactoring
of component names, lighter atom wrappers.

**What to do now:** The RFC is open and syntax may change. Use current selectors.
Name component classes cleanly (e.g., `DsButton`, `SearchBar`) so the migration
is mechanical when selectorless stabilizes. Do not depend on selectorless syntax
in tooling or generators yet.

> **2025 file naming:** Angular 21 uses the 2025 file naming convention by default: `button.ts` (not `button.component.ts`), class `Button` (not `ButtonComponent`). The `Component` suffix is no longer generated or expected. Adopt 2025 naming for new projects.

---

## Signal Forms (Developer Preview)

A signal-native forms API where controls expose value, validity, and
dirty/touched state as signals.

### Facade Pattern for Safe Adoption

Abstract form logic behind a molecule-level API so organisms are insulated from
the eventual `ReactiveFormsModule` to Signal Forms swap.

```typescript
// form-field.facade.ts -- molecule-level abstraction
export class FormFieldFacade<T> {
  private control: FormControl<T>;  // ReactiveFormsModule today

  value = toSignal(this.control.valueChanges, { initialValue: this.control.value });
  valid = toSignal(this.control.statusChanges.pipe(map(s => s === 'VALID')), { initialValue: true });

  constructor(initial: T, validators?: ValidatorFn[]) {
    this.control = new FormControl(initial, { validators });
  }

  setValue(val: T) { this.control.setValue(val); }
  getControl() { return this.control; }  // only used inside the molecule template
}

// When Signal Forms stabilize, swap internals here. Organisms never change.
```

**What to do now:** Use `ReactiveFormsModule` behind molecule-level facades.
When Signal Forms reach stable, swap the facade internals. Organisms and above
see only signals.

---

## CDK a11y Primitives (Stable)

`@angular/cdk/a11y` provides focus management, live announcer, focus trap, and
keyboard interaction utilities. These are **stable and available now**.

> **Clarification on "Angular Aria" / headless components:** Community
> discussion references a future headless, accessible component library
> (sometimes called "Angular Aria"). This is **speculative** -- no official
> package ships under that name. What *does* exist is `@angular/cdk/a11y`, which
> provides low-level a11y primitives. Do not build architecture on the
> speculative headless library.

| Scenario | Foundation |
|---|---|
| Standard UI patterns (table, dropdown, calendar) | PrimeNG atom wrappers |
| Custom patterns where Figma diverges from PrimeNG | CDK a11y primitives + design tokens |

**What to do now:** Use `@angular/cdk/a11y` (FocusTrap, LiveAnnouncer,
FocusMonitor) when building custom atoms. Watch for official headless library
announcements but do not plan around them.

---

## PrimeNG Customization Strategy

When customizing PrimeNG atoms, prefer mechanisms in this order:

### 1. `definePreset()` Token Overrides (First Choice)

Override design tokens at the preset level. Affects all instances consistently.

```typescript
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: { 50: '#f0f9ff', /* ... */ 950: '#0c4a6e' }
  }
});
```

### 2. Passthrough (pt) API (Second Choice)

The `pt` API lets you attach classes, styles, and attributes to internal DOM
elements of PrimeNG components. This is the primary mechanism for structural
customization that tokens cannot reach.

```html
<p-select
  [pt]="{ list: { class: 'max-h-48 overflow-auto' }, item: { class: 'text-sm' } }"
/>
```

### 3. Standalone Component Imports

PrimeNG 21 supports standalone component imports. Use standalone for atoms; use module imports (e.g., `TableModule`) only for complex organism primitives requiring template directives.

```typescript
// Preferred: standalone import for atoms
import { Button } from 'primeng/button';

@Component({
  imports: [Button],
  // ...
})
```

### 4. CSS Overrides (Last Resort)

`::ng-deep` or `ViewEncapsulation.None` -- scope these to atom wrapper
components only. Never apply unscoped global overrides to PrimeNG internals.

> For full PrimeNG fit risk analysis, see [10-derisking.md](./10-derisking.md).

---

## Angular CLI MCP Server (Experimental)

Community-driven and experimental. There is no stable `ng mcp` command built
into the Angular CLI. Available as a separate package that exposes project
structure and Angular conventions to AI agents via the Model Context Protocol.

**Impact:** When available, pairs with Figma MCP for design+framework-aware code
generation. The AI agent receives design tokens from Figma and Angular
conventions from the MCP server.

**What to do now:** Try it if your tooling supports MCP. Do not build workflows
that depend on it -- treat as a productivity bonus, not infrastructure.

---

## PrimeNgX (Announced, No Ship Date)

PrimeTek has signaled intent to build a signal-native component library. This is
**not a confirmed named product with a public roadmap or ship date**. PrimeNG
v21+ remains actively maintained.

### Why Atom Wrappers Protect You

```
  Today                           Future
  ─────                           ──────
  Molecule                        Molecule
     │                               │
     ▼                               ▼
  ┌────────────┐               ┌────────────┐
  │ Atom       │               │ Atom       │
  │ Wrapper    │               │ Wrapper    │
  │ ┌────────┐ │               │ ┌────────┐ │
  │ │PrimeNG │ │    ──────►    │ │PrimeNgX│ │
  │ │  v21   │ │   swap when   │ │        │ │
  │ └────────┘ │    ready      │ └────────┘ │
  └────────────┘               └────────────┘
```

Migration happens one atom at a time. Molecules, organisms, and above never
change.

**What to do now:** Use PrimeNG v21. The atom wrapper pattern already insulates
you. Monitor PrimeTek announcements.

---

## Architecture Awareness Diagram

```
  ┌─────────────────────────────────────────────────────────┐
  │                        Pages                            │
  │         signal services · toSignal() · ErrorHandler     │
  ├─────────────────────────────────────────────────────────┤
  │                      Templates                          │
  │              @defer blocks · layout composition          │
  ├─────────────────────────────────────────────────────────┤
  │                      Organisms                          │
  │    effect() · linkedSignal() · catchError fallbacks     │
  ├─────────────────────────────────────────────────────────┤
  │                      Molecules                          │
  │          computed() · FormFieldFacade · toSignal()       │
  ├─────────────────────────────────────────────────────────┤
  │                        Atoms                            │
  │     input() · output() · model() · signal equality      │
  ├──────────────────────┬──────────────────────────────────┤
  │    PrimeNG v21       │     CDK a11y primitives          │
  │  (standard patterns) │  (custom accessible patterns)    │
  │  [STABLE]            │  [STABLE]                        │
  └──────────────────────┴──────────────────────────────────┘

  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ future / watch ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
  Selectorless [RFC]    Signal Forms [Dev Preview]
  Headless lib [Speculative]    PrimeNgX [Announced]
```

Everything above the dotted line is stable and safe to build on today.
Everything below is worth tracking but should not drive architectural decisions.

---

## Cross-References

- For PrimeNG fit risk and fallback strategy, see [10-derisking.md](./10-derisking.md).
- For project structure and module boundaries, see [03-project-structure.md](./03-project-structure.md).
