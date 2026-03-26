# PBI Templates by Atomic Level

> For the general PBI writing process, see [12-pbi-writing-guide](./12-pbi-writing-guide.md). This file contains prototype-specific worked examples.

Lessons from the prototype simulation on writing complete PBIs for each level of the atomic hierarchy.

---

## General Rules

1. **Reference the shared model, don't redefine it.** "Uses `Project` from `src/app/models`" — not a copy of the interface.
2. **Acceptance criteria in Given/When/Then.** Criteria written before code force completeness. Criteria written after code just describe what was built.
3. **State before visual.** List the states first, then reference the design spec for how each looks.
4. **One level at a time, bottom up.** Atom PBIs → molecule PBIs → organism PBIs → template PBIs → page PBIs.
5. **Include what NOT to build.** "Inputs: label, severity, outlined. NOT: icon, loading, size (add when needed)."

---

## Atom PBI Template

### Required Fields
- **Component name** and selector (e.g., DsButton, ds-button)
- **Wraps:** which PrimeNG component (with import path)
- **Inputs:** name, type (use exact union types, not string), default value
- **Outputs:** name, event type
- **Visual states:** default, hover, focus, active, disabled — reference design spec
- **Token compliance:** which var(--p-*) values apply
- **NOT in scope:** inputs deferred to future need

### Example: DsButton
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

---

## Molecule PBI Template

### Required Fields
- **Component name** and selector
- **Composes:** which atoms (explicit list)
- **Inputs/Outputs/Model:** the API contract organisms depend on
- **Interaction behavior:** what happens on Enter, click, blur (not just visuals)
- **Template style:** inline (simple) or separate .html/.scss (complex)

### Example: DsSearchBar
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

---

## Organism PBI Template

### Required Fields
- **Component name** and selector
- **Composes:** which molecules, atoms, PrimeNG components
- **Data interface:** reference shared model (don't redefine)
- **Inputs:** data array/object, isLoading, error — organisms receive data, don't fetch it
- **Outputs:** user actions (selection, retry, search)
- **ALL states explicitly listed** with visual reference:
  - Loading: skeleton shape, count, dimensions (reference design spec)
  - Error: message copy pattern, retry affordance
  - Empty: icon, message, optional action
  - Data: layout, column counts
  - Additional states (search-no-results, partial failure)
- **Responsive:** column counts per breakpoint
- **Keyboard:** focusable items, Enter/Space behavior
- **Who designs non-data states?** Reference design spec or flag for designer input

### Example: DsProjectTable
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

States (→ see design-spec-prototype.md for visuals):
  1. Loading: skeleton header (40px) + 5 skeleton rows (48px each)
  2. Error: p-message severity="error" "Unable to load projects" + retry DsButton (secondary, outlined)
  3. Empty: DsEmptyState icon=pi-inbox message="No projects found"
  4. Search-no-results: DsEmptyState icon=pi-search message="No results for '[term]'" actionLabel="Clear search"
  5. Data: sortable table — columns: ID, Name, Owner (with Avatar), Status (DsTag), Created, Action (DsButton "View")

Responsive:
  - >= 640px: full table, all columns visible
  - < 640px: horizontal scroll, min-width on table

Keyboard:
  - Tab to search input → Tab to search button → Tab to table headers → Tab to row actions
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

---

## Template PBI Template

### Required Fields
- **Component name** and selector
- **Slots:** named ng-content projection points with purpose
- **Layout inputs:** title, subtitle, configuration (NOT data)
- **Responsive behavior** per breakpoint
- **Landmark roles** for accessibility
- **Explicit constraint:** no data binding, no services, no business logic

### Example: DsDashboardLayout
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

---

## Page PBI Template

### Required Fields
- **Route** path and params
- **Template:** which layout shell
- **Organisms:** which organisms composed into the template
- **Services:** which services injected
- **User journey:** which journey this page enables (reference by name)
- **Error handling:** what happens on 404, auth failure, navigation error
- **NOT in scope:** data logic belongs in organisms, not pages

### Example: Dashboard Page
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
  - Click project card → navigate to /detail/:id
  - Dark mode toggle in header-action slot

NOT in scope: data filtering (that's in DsProjectTable on List page), pagination, export

AC:
  - GIVEN /api/stats fails but /api/projects succeeds, THEN stats shows error+retry, projects renders normally
  - GIVEN project card clicked, WHEN navigating, THEN arrives at /detail/:id with correct project
  - GIVEN page loads, WHEN APIs respond, THEN loading skeletons visible for duration of API delay
```
