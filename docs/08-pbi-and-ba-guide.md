# PBI and BA Guide

> **When to read:** Before writing any PBI for an organism or page. Developers: read sections 1-3 for the template and examples. BAs: read the full doc. Read time: ~12 minutes.

> Consolidates the PBI writing process, BA involvement guide, and worked examples into one reference.

---

## 1. Key Principles

1. **Bottom up.** Write atom PBIs before molecule PBIs, molecule before organism, organism before page. Each level references the one below.
2. **Acceptance criteria before code.** Given/When/Then criteria written before implementation force completeness. Criteria written after code just describe what was built.
3. **Reference shared models.** "Uses `Project` from `models/`" — don't redefine interfaces in each PBI.
4. **Include what's NOT in scope.** "Inputs: label, severity, outlined. NOT: icon, loading, size." Prevents gold-plating.
5. **State before visual.** List all states, then reference the design spec for how each looks.

---

## 2. PBI Structure by Atomic Level

### Atoms

**Required:** component name, selector, which PrimeNG component it wraps, inputs with exact types (use union types not `string`), outputs, visual states (default/hover/focus/disabled), token compliance.

Atoms are technical PBIs — developers can write these without BA involvement.

**Common mistake:** Using `severity: string` instead of `severity: 'success' | 'info' | 'warn' | 'danger'`. PrimeNG uses union types; widening to string causes type errors at the binding site.

### Molecules

**Required:** component name, selector, which atoms it composes, input/output contract (this is the API organisms depend on), interaction behavior (Enter/click/blur — not just visuals).

Molecules are technical PBIs. The interaction spec is the part most often missing — "Enter key triggers search" must be explicit, not assumed.

### Organisms

**Required:** component name, selector, which molecules/atoms it composes, data interface (reference shared model), inputs (data + isLoading + error), outputs (user actions), ALL states with visual reference, responsive column counts per breakpoint, keyboard nav, who designed the non-data states.

Organisms can either inject services directly (see [01-atomic-hierarchy](./01-atomic-hierarchy.md) section Level 3) or receive data as inputs from the page. Both patterns are valid — injecting services makes organisms self-contained, while input-driven organisms are more reusable and easier to test. The PBI should specify which pattern this organism uses.

**This is where PBIs fail.** The prototype simulation found that without explicit state specs, developers implement 2 states (data + loading) and call it done. A complete organism PBI lists:

| State | What it shows | Design spec reference |
|-------|--------------|----------------------|
| Loading | Skeleton shapes matching data layout | design-spec § Loading |
| Error | Message copy + retry affordance | design-spec § Error |
| Empty | Icon + message + optional action | design-spec § Empty |
| Data | Full component rendering | design-spec § [Component] |
| Search-no-results | "No results for [query]" + Clear | design-spec § Search |

Organisms need BA involvement — someone must elicit missing states before the PBI is written.

### Templates

**Required:** component name, selector, named ng-content slots with purpose, layout inputs (NOT data), responsive behavior per breakpoint, landmark roles, explicit constraint (no data binding, no services).

Templates are simple to spec but impactful if wrong — a broken template breaks every page using it.

### Pages

**Required:** route path + params, which template, which organisms composed into it, which services injected, which user journey it enables, error handling (404, auth failure).

Page PBIs should reference journeys, not just list components. Write page PBIs last — they can't be specified until organisms exist.

**Common mistake:** Putting data logic in the page PBI. If the PBI says "filter projects by search term," that belongs in the organism PBI. Pages wire services to organisms — they don't contain logic.

---

## 3. Worked Examples

### 3.1 Atom: DsButton

```
Atom: DsButton
Wraps: p-button (primeng/button, standalone import)
Selector: ds-button
Inputs:
  - label: string (optional)
  - severity: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warn' | 'help' | 'contrast' (default: 'primary')
  - outlined: boolean (default: false)
Output: clicked (void)

States:
  - Default: per severity color from preset
  - Hover: var(--p-primary-hover-color) background shift
  - Focus: 2px ring in var(--p-primary-color), 2px offset
  - Disabled: 50% opacity, pointer-events none

Tokens: border-radius from components.button.root.borderRadius
NOT in scope: icon, loading, size variants, badge (add when needed)

AC:
  - GIVEN severity="danger", WHEN rendered, THEN shows danger-colored button
  - GIVEN button, WHEN clicked, THEN emits clicked event
  - GIVEN button, WHEN focused via Tab, THEN shows 2px primary focus ring
  - GIVEN disabled state, WHEN rendered, THEN shows 50% opacity, not clickable
```

### 3.2 Molecule: DsSearchBar

```
Molecule: DsSearchBar
Composes: DsInput + DsButton
Selector: ds-search-bar
Model: value (string, two-way binding)
Input: placeholder (string, default "Search...")
Output: searched (string — emitted with current value)

Behavior:
  - Enter key in input triggers searched output with current value
  - Button click triggers searched output with current value
  - Value updates via two-way binding as user types

Template: inline (2 elements, simple composition)

AC:
  - GIVEN user types "Alpha", WHEN Enter pressed, THEN searched emits "Alpha"
  - GIVEN user types "Alpha", WHEN Search button clicked, THEN searched emits "Alpha"
  - GIVEN empty input, WHEN Search clicked, THEN searched emits ""
```

### 3.3 Organism: DsProjectTable

```
Organism: DsProjectTable
Composes: DsSearchBar, DsTag, DsButton, DsEmptyState, p-table (TableModule)
Selector: ds-project-table
Data interface: Project[] from src/app/models

Inputs:
  - projects: Project[] (default: [])
  - isLoading: boolean (default: false)
  - error: string | null (default: null)
Outputs:
  - projectSelected: Project (emitted when View clicked or row selected)
  - retryClicked: void (emitted when retry button in error state clicked)

States (see [design-spec.md#prototype-phase-extensions](./design-spec.md#prototype-phase-extensions) for visuals):
  1. Loading: skeleton header (40px) + 5 skeleton rows (48px each)
  2. Error: p-message severity="error" "Unable to load projects" + retry DsButton (secondary, outlined)
  3. Empty: DsEmptyState icon=pi-inbox message="No projects found"
  4. Search-no-results: DsEmptyState icon=pi-search message="No results for '[term]'" actionLabel="Clear search"
  5. Data: sortable table — columns: ID, Name, Owner (with Avatar), Status (DsTag), Created, Action (DsButton "View")

Responsive:
  - >= 640px: full table, all columns visible
  - < 640px: horizontal scroll, min-width on table

Keyboard:
  - Tab to search input -> Tab to search button -> Tab to table headers -> Tab to row actions
  - Enter in search input triggers filter
  - Sort headers respond to Enter/Space

Designer input needed: skeleton dimensions confirmed? Error copy confirmed?

AC:
  - GIVEN isLoading=true, WHEN rendered, THEN shows skeleton header + 5 skeleton rows
  - GIVEN search typed "zzzzz", WHEN no matches, THEN shows "No results for 'zzzzz'" state
  - GIVEN search, WHEN cleared, THEN shows all projects again
  - GIVEN error + retry clicked, WHEN clicked, THEN emits retryClicked
  - GIVEN table on mobile (<640px), WHEN rendered, THEN has horizontal scroll
```

### 3.4 Template: DsDashboardLayout

```
Template: DsDashboardLayout
Selector: ds-dashboard-layout
Inputs:
  - title: string (page heading)
  - subtitle: string (page subheading)
Slots:
  - header-action: projected into header area (e.g., export button, dark mode toggle)
  - content: main body area (organisms projected here)

Constraint: Zero data binding. No services. Layout behavior only.
            Collapsed/expanded state is OK (layout behavior). Data fetching is NOT.

Responsive:
  - >= 1024px: header (full width) + content with 24px padding
  - 640-1023px: 16px padding
  - < 640px: 8px padding, title font-size reduced to 22px

Landmarks: <header role="banner">, <main role="main">

AC:
  - GIVEN any content projected, WHEN at 375px, THEN content stacks vertically with 8px padding
  - GIVEN title="Dashboard", WHEN rendered, THEN shows heading with title
  - GIVEN no header-action projected, WHEN rendered, THEN header area shows title only (no empty space)
```

### 3.5 Page: Dashboard

```
Page: Dashboard
Route: /dashboard (default redirect from /)
Template: DsDashboardLayout (title="Dashboard", subtitle="Welcome back")
Organisms:
  - DsStatGrid: stats from ProjectService.stats
  - DsProjectCardGrid: projects from ProjectService.projects
Services: ProjectService (httpResource for /api/stats and /api/projects)
Journey: Journey 1 (Browse Projects) — this page is the entry point

Behavior:
  - Stats and projects load independently (partial failure OK — one can error while other renders)
  - Click project card -> navigate to /detail/:id
  - Dark mode toggle in header-action slot

NOT in scope: data filtering (that's in DsProjectTable on List page), pagination, export

AC:
  - GIVEN /api/stats fails but /api/projects succeeds, THEN stats shows error+retry, projects renders normally
  - GIVEN project card clicked, WHEN navigating, THEN arrives at /detail/:id with correct project
  - GIVEN page loads, WHEN APIs respond, THEN loading skeletons visible for duration of API delay
```

---

## 4. Where a BA Adds Value

The simulation found that design specs cover the "happy path" (data-loaded state) only. Loading, empty, error, and edge-case states were invented by the developer. 9 out of 12 organism state renderings had no design backing. A BA sitting between design and dev would have caught these gaps before code was written.

**Atoms and molecules** are technical PBIs that developers can write. The component API is the requirement.

**Organisms and pages** are user-facing PBIs that need BA involvement. This is where states, journeys, error recovery, and user intent matter.

The line maps to the atomic cascade rule — below the organism boundary is "dumb UI," above it is "smart features" where requirements drive design.

### 4.1 State Discovery (highest impact)

Before any PBI is written, walk through each organism and ask:
- What happens when there's no data?
- What happens when the API fails?
- What happens when it's loading?
- What happens when a search returns nothing?
- What happens when one API succeeds and another fails?

Produce a **state matrix** per organism:

| Organism | Loading | Error | Empty | Data | Search-No-Results | Partial Failure |
|----------|---------|-------|-------|------|-------------------|-----------------|
| StatGrid | 4 skeletons | Message + retry | "No stats available" | Stat cards | N/A | N/A |
| ProjectTable | 5 skeleton rows | Message + retry | "No projects found" | Sortable table | "No results for X" + Clear | N/A |
| Dashboard (page) | Both loading | Both error | Both empty | Both data | N/A | Stats OK, projects error |

Flag states that need designer input before the PBI is ready for dev.

### 4.2 Acceptance Criteria Authoring

Own the acceptance criteria. Write them from the user's perspective, not the component's.

**Developer-written:** "GIVEN search with no matches, THEN show empty state"
**BA-written:** "GIVEN a user searching for a project that doesn't exist, WHEN they see no results, THEN they should understand why and know how to recover (clear search button visible)"

The difference: the BA criterion includes the user's mental model and recovery path.

### 4.3 Design-Dev Handoff Gap

Maintain a **design questions log** — every time dev encounters a state the design doesn't cover:

| Date | Component | Question | Asked To | Answer | Updated In |
|------|-----------|----------|----------|--------|------------|
| Mar 22 | ProjectTable | What does search-no-results look like? | Designer | pi-search icon + "No results" + Clear button | PBI #42, [design-spec.md#prototype-phase-extensions](./design-spec.md#prototype-phase-extensions) |
| Mar 23 | Dashboard | What happens when stats fail but projects load? | Designer | Show error in stats section only | PBI #38, acceptance-criteria.md |

For a 2-4 person team, this doesn't need a tool — a shared doc or Slack thread that the BA owns is enough.

### 4.4 Shared Model / Interface Definition

Define the canonical data model EARLY:
- What fields does a "Project" have? What types? Required vs optional?
- Does the API return this shape, or does the frontend transform it?
- Align with backend before dev starts building to the model.

The prototype found `Project` defined differently in two pages. The BA would have caught this by owning the model definition.

### 4.5 User Journey Definition

Define user journeys BEFORE component PBIs:
- Journey 1: Browse Projects (Dashboard → card click → Detail → Back)
- Journey 2: Search and Filter (List → search → filter → View → Detail)
- Journey 3: Handle Errors (/detail/999 → error → navigate back)

Map each journey to components it touches. Use journeys to prioritize PBIs — components in Journey 1 are higher priority than Journey 3-only components.

### 4.6 Scope Control

For each PBI, explicitly define what's in scope and what's deferred:
- "DsButton exposes: label, severity, outlined. NOT: icon, loading, size (add when needed)"
- Apply the test: "Does this input ship screens faster?" If no, defer it.

### 4.7 Where a BA is NOT Needed

- Token mapping (design-spec → definePreset) — pure technical work
- Folder structure / architecture decisions
- Tooling setup (Storybook, MSW, Stylelint)
- Test implementation
- CSS / responsive implementation (as long as requirements specify breakpoints)

### 4.8 BA's Rhythm

The table below maps BA activities to sprint phases. If your team uses continuous flow or kanban, adapt these to your cadence — the key principle is that state discovery and acceptance criteria happen before code.

| When | What | Output |
|------|------|--------|
| Sprint planning | Review PBIs for completeness, flag missing states | Updated PBIs with all states |
| Before dev starts a PBI | Confirm design spec covers all states in the PBI | Design questions log entries |
| During dev | Answer "what should happen when...?" questions | Updated acceptance criteria |
| Before PR review | Verify acceptance criteria are met, not just "it builds" | Journey walkthrough notes |
| Retrospective | Log which states were discovered during dev (not before) | Process improvement items |

---

## 5. Acceptance Criteria Format

```
GIVEN [precondition]
WHEN [action or event]
THEN [expected outcome]
```

**Atom example:**
```
GIVEN severity="danger", WHEN rendered, THEN shows danger-colored button
```

**Organism example:**
```
GIVEN search typed "zzzzz", WHEN no matches, THEN shows "No results for 'zzzzz'" with Clear button
```

**Journey example:**
```
GIVEN /api/stats fails but /api/projects succeeds,
WHEN dashboard loads,
THEN stats section shows error+retry, projects section renders normally
```

---

## 6. State Discovery Checklist

Before writing an organism PBI, ask:

- [ ] What does loading look like? (skeleton shape, count, dimensions)
- [ ] What does error look like? (message copy, retry affordance)
- [ ] What does empty look like? (icon, message, create action?)
- [ ] Is search-no-results distinct from empty?
- [ ] Can this organism partially fail? (one data source fails, another succeeds)
- [ ] What does slow loading look like? (3-second delay — is skeleton sufficient?)
- [ ] What does stale data during reload look like?
- [ ] Who designed these states? (reference design spec or flag for designer)

---

## Cross-References

- For atomic level definitions, see [01-atomic-hierarchy](./01-atomic-hierarchy.md)
- For QA criteria per level, see [07-qa-per-atomic-level](./07-qa-per-atomic-level.md)
- For implementation tips, see [11-implementation-tips](./11-implementation-tips.md)
