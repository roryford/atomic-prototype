# Acceptance Criteria

Written BEFORE implementation. Each criterion drives a Storybook play function, a unit test, or a manual test checklist item.

> These acceptance criteria are examples from the prototype simulation. Your criteria will reflect your own domain and user journeys. Use these as templates for the level of detail expected, not as literal requirements.

---

## Atoms

### DsButton
- GIVEN default props, WHEN rendered, THEN shows primary severity button
- GIVEN severity="danger", WHEN rendered, THEN shows danger-colored button
- GIVEN outlined=true, WHEN rendered, THEN shows outlined variant
- GIVEN button, WHEN clicked, THEN emits clicked event
- GIVEN button, WHEN focused, THEN shows 2px primary focus ring
- GIVEN disabled state, WHEN rendered, THEN shows 50% opacity, not clickable

### DsTag
- GIVEN value="Active", WHEN rendered, THEN displays "Active" text
- GIVEN severity="success", WHEN rendered, THEN shows green success styling
- GIVEN severity="danger", WHEN rendered, THEN shows red danger styling

### DsInput
- GIVEN placeholder="Search...", WHEN rendered, THEN shows placeholder text
- GIVEN value bound via model, WHEN user types, THEN model updates
- GIVEN input, WHEN focused, THEN shows focus ring

### DsEmptyState
- GIVEN icon="pi-inbox" message="No data", WHEN rendered, THEN shows icon + message centered
- GIVEN actionLabel="Create", WHEN action clicked, THEN emits actionClicked
- GIVEN no actionLabel, WHEN rendered, THEN hides action button

---

## Molecules

### DsStatCard
- GIVEN label + value + icon, WHEN rendered, THEN shows icon left, value + label stacked right
- GIVEN icon="pi-users", WHEN rendered, THEN shows users icon with primary color

### DsSearchBar
- GIVEN placeholder, WHEN rendered, THEN input shows placeholder
- GIVEN user types "Alpha", WHEN Search clicked, THEN emits searched with "Alpha"
- GIVEN user types "Alpha", WHEN Enter pressed, THEN emits searched with "Alpha"
- GIVEN value bound via model, WHEN user types, THEN model updates

### DsFormField
- GIVEN label="Project Name", WHEN rendered, THEN shows uppercase label above content slot
- GIVEN fullWidth=true, WHEN rendered, THEN stretches to full container width
- GIVEN child content, WHEN rendered, THEN projects content below label

---

## Organisms

### StatGrid
- GIVEN isLoading=true, WHEN rendered, THEN shows 4 skeleton rectangles (88px height) in responsive grid
- GIVEN error is set, WHEN rendered, THEN shows "Unable to load stats" with retry button
- GIVEN error + retry clicked, WHEN clicked, THEN emits retryClicked event
- GIVEN stats=[] (empty), WHEN rendered, THEN shows empty state with "No stats available"
- GIVEN 4 stats, WHEN rendered, THEN shows 4 DsStatCard components
- GIVEN 4 stats at >= 1440px, WHEN rendered, THEN shows 4 columns
- GIVEN 4 stats at 640-1023px, WHEN rendered, THEN shows 2 columns
- GIVEN 4 stats at < 640px, WHEN rendered, THEN shows 1 column

### ProjectCardGrid
- GIVEN isLoading=true, WHEN rendered, THEN shows 3 skeleton cards (180px height)
- GIVEN error is set, WHEN rendered, THEN shows error message with retry button
- GIVEN projects=[] (empty), WHEN rendered, THEN shows empty state with "No projects found"
- GIVEN 3 projects, WHEN rendered, THEN shows 3 project cards with avatar, name, tag, description
- GIVEN project card, WHEN clicked, THEN emits projectSelected with correct Project object
- GIVEN project card, WHEN focused + Enter pressed, THEN emits projectSelected
- GIVEN project card, WHEN hovered, THEN shows elevated shadow per design spec

### ProjectTable
- GIVEN isLoading=true, WHEN rendered, THEN shows skeleton header + 5 skeleton rows
- GIVEN error is set, WHEN rendered, THEN shows error message with retry button
- GIVEN projects=[] (empty), WHEN rendered, THEN shows empty state with "No projects found"
- GIVEN 18 projects, WHEN rendered, THEN shows sortable table with all rows
- GIVEN search typed "Alpha", WHEN filtering, THEN table shows only matching rows
- GIVEN search typed "zzzzz", WHEN no matches, THEN shows "No results for 'zzzzz'" state
- GIVEN search cleared, WHEN empty, THEN shows all projects again
- GIVEN row "View" button, WHEN clicked, THEN emits projectSelected with correct Project
- GIVEN table on mobile (< 640px), WHEN rendered, THEN table has horizontal scroll

---

## User Journeys

### Journey 1: Browse Projects
- GIVEN user on /dashboard, WHEN page loads, THEN loading skeletons appear for ~300ms
- GIVEN dashboard loaded, WHEN stats appear, THEN shows 4 stat cards with values
- GIVEN dashboard loaded, WHEN project cards appear, THEN shows 3 project cards
- GIVEN project card "Project Alpha", WHEN clicked, THEN navigates to /detail/1
- GIVEN /detail/1 loaded, WHEN rendered, THEN shows project name, owner, status, description
- GIVEN detail page, WHEN "Back to List" clicked, THEN navigates to /list

### Journey 2: Search and Filter
- GIVEN user on /list, WHEN page loads, THEN loading skeleton appears then table populates
- GIVEN table loaded, WHEN user types "Alpha" in search, THEN table filters to matching rows
- GIVEN filtered results, WHEN user clicks "View", THEN navigates to /detail/:id
- GIVEN search, WHEN user clears search, THEN all 18 rows return

### Journey 3: Handle Errors
- GIVEN user navigates to /detail/999, WHEN page loads, THEN shows "Project not found" error
- GIVEN error state, WHEN user clicks back or navigates, THEN returns to /list
- GIVEN /dashboard, WHEN projects API fails but stats succeeds, THEN stats render normally, projects section shows error with retry button

---

## State Discovery (to validate during simulation)

Beyond the known states, explore:
- Partial failure: one API fails, others succeed
- Slow connection: 3-second delays — does skeleton feel right?
- Large dataset: 200 projects — does table handle it?
- Stale data on reload: does `reloading` status preserve previous data?
- Search-no-results vs empty: are they visually distinct?
