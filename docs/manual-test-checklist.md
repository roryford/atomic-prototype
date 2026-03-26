# Manual Test Checklist

> For the general QA framework per atomic level, see [04-qa-per-atomic-level](./04-qa-per-atomic-level.md).

Manual verification items that cannot be fully covered by unit tests or Storybook play functions. These require a running application (`ng serve`) and a real browser.

---

## Prerequisites

- [ ] Application builds without errors (`ng build`)
- [ ] Application serves locally (`ng serve`)
- [ ] MSW service worker is active (check browser DevTools console for "Mocking enabled" message)
- [ ] Browser DevTools responsive mode available for breakpoint testing

---

## Journey 1: Browse Projects

### Dashboard Load
- [ ] Navigate to `/dashboard`
- [ ] Loading skeletons appear for stat grid (4 skeleton rectangles, 88px height)
- [ ] Loading skeletons appear for project card grid (3 skeleton cards, 180px height)
- [ ] Skeletons use wave animation (PrimeNG default)
- [ ] After ~300ms, skeletons are replaced with real data
- [ ] 4 stat cards display with icon, value, and label
- [ ] 3 project cards display with avatar, name, tag, and description

### Project Card Interaction
- [ ] Hover over a project card — elevated shadow appears (`box-shadow: 0 4px 12px rgba(0,0,0,0.15)`)
- [ ] Click project card "Project Alpha" — navigates to `/detail/1`
- [ ] Focus a project card with keyboard (Tab) — 2px primary focus ring appears
- [ ] Press Enter on focused card — navigates to detail page

### Detail Page
- [ ] `/detail/1` loads and shows project name, owner, status tag, and description
- [ ] Detail skeleton (form-shaped) appears briefly during load
- [ ] "Back to List" button is visible and clickable
- [ ] Click "Back to List" — navigates to `/list`

---

## Journey 2: Search and Filter

### List Page Load
- [ ] Navigate to `/list`
- [ ] Table loading skeleton appears (1 header row + 5 body rows)
- [ ] After load, table shows 18 project rows with sortable columns

### Search Interaction
- [ ] Type "Alpha" in the search bar input
- [ ] Click "Search" button — table filters to matching rows only
- [ ] Verify filtered results show only rows containing "Alpha"
- [ ] Clear the search input and search again — all 18 rows return
- [ ] Type "Alpha" and press Enter — table filters (Enter key triggers search)

### Search No Results
- [ ] Type "zzzzz" in the search bar and search
- [ ] "No results for 'zzzzz'" message appears with `pi-search` icon
- [ ] "Clear search" button is visible below the message
- [ ] Click "Clear search" — all 18 rows return

### Table Row Interaction
- [ ] Click "View" button on a project row — navigates to `/detail/:id`
- [ ] Verify the detail page shows the correct project (matching the row clicked)

---

## Journey 3: Handle Errors

### Not Found
- [ ] Navigate to `/detail/999` (non-existent project)
- [ ] "Project not found" error message appears
- [ ] Navigate back (browser back or link) — returns to list or dashboard

### Partial Failure (requires MSW handler modification)
- [ ] Modify MSW handler to return 500 for `/api/projects` but 200 for `/api/stats`
- [ ] Navigate to `/dashboard`
- [ ] Stat grid renders normally with 4 stat cards
- [ ] Project card grid shows error message "Unable to load projects" with retry button
- [ ] Click retry button — projects attempt to reload

---

## Dark Mode

### Toggle Behavior
- [ ] Locate the dark mode toggle in the navigation bar
- [ ] Click toggle — page transitions to dark theme
- [ ] Click toggle again — page transitions back to light theme

### Dark Mode Visual Checks
- [ ] **Nav bar:** Background changes from light to dark surface color
- [ ] **Stat cards:** Background uses `var(--p-surface-0)` (resolves to dark value)
- [ ] **Project cards:** Background and text colors invert appropriately
- [ ] **Table:** Background, row striping, and text adapt to dark theme
- [ ] **Tags:** Severity colors (success green, danger red) remain visible and distinguishable
- [ ] **Buttons:** Primary buttons maintain contrast in dark mode
- [ ] **Skeletons:** Skeleton animation colors adapt to dark background
- [ ] **Error messages:** Error states remain readable with appropriate contrast
- [ ] **Empty states:** Muted text color adapts (`var(--p-text-muted-color)` resolves correctly)
- [ ] **Detail page:** Form field labels and content remain legible

### Dark Mode — No Hardcoded Colors
- [ ] In dark mode, verify no elements appear with white backgrounds that should be dark (indicates a missed hex value)
- [ ] In dark mode, verify no text appears invisible (same color as background)

---

## Responsive Breakpoints

### Mobile (< 640px)

- [ ] **Stat grid:** Displays as 1 column (cards stack vertically)
- [ ] **Project card grid:** Displays as 1 column
- [ ] **Project table:** Has horizontal scroll (table wider than viewport)
- [ ] **Navigation:** Remains usable (not cut off or overlapping)
- [ ] **Search bar:** Input and button remain accessible, not clipped

### Tablet (640px - 1023px)

- [ ] **Stat grid:** Displays as 2 columns
- [ ] **Project card grid:** Displays as 2 columns
- [ ] **Project table:** Full width, no horizontal scroll needed
- [ ] **Detail page:** Form fields remain readable

### Desktop (1024px - 1439px)

- [ ] **Stat grid:** Displays as 3 columns
- [ ] **Project card grid:** Displays as 3 columns
- [ ] **Project table:** Full width with comfortable spacing

### Wide (>= 1440px)

- [ ] **Stat grid:** Displays as 4 columns
- [ ] **Project card grid:** Displays as 3 columns (caps at 3)
- [ ] **Project table:** Full width, no wasted space

---

## Interaction States (all interactive elements)

### Buttons (DsButton)
- [ ] **Default:** Primary severity styling visible
- [ ] **Hover:** Background shifts to `var(--p-primary-hover-color)`
- [ ] **Focus:** 2px ring in primary color, 2px offset, solid outline
- [ ] **Active/Pressed:** Slightly darker than hover
- [ ] **Disabled:** 50% opacity, cursor indicates not-clickable, no hover/focus treatment

### Buttons — Outlined Variant
- [ ] **Default:** Border visible, transparent background
- [ ] **Hover:** Background fills subtly
- [ ] **Focus:** Same focus ring as filled variant

### Buttons — Danger Severity
- [ ] **Default:** Danger-colored (red) styling
- [ ] **Hover:** Darker red

### Input (DsInput)
- [ ] **Default:** Placeholder text visible
- [ ] **Focus:** Focus ring appears
- [ ] **Typing:** Value updates as user types

### Tags (DsTag)
- [ ] **Success:** Green styling for "Active" status
- [ ] **Danger:** Red styling for "At Risk" or error status
- [ ] **Default:** Neutral styling for other values

---

## Accessibility Spot Checks

- [ ] Tab through the dashboard — focus order follows visual order (stat cards, then project cards)
- [ ] Tab through the list page — focus reaches search input, search button, then table rows
- [ ] All interactive elements (buttons, cards, links) are reachable via keyboard
- [ ] Focus rings are visible on all focusable elements (not hidden by overflow or z-index)
- [ ] Screen reader announces button labels correctly (test with VoiceOver on macOS: Cmd+F5)
- [ ] Color contrast in both light and dark mode meets WCAG AA (use browser DevTools audit)

---

## Storybook Verification

- [ ] Run Storybook: `ng run atomic-prototype:storybook`
- [ ] All 10 story files load without errors
- [ ] Each atom story renders all variants (default, severity, outlined, disabled)
- [ ] Each organism story renders all states (loading, error, empty, data)
- [ ] PrimeIcons display correctly (loaded via CDN in preview-head.html)
- [ ] Dark mode class can be toggled in Storybook (via decorator or toolbar addon)
- [ ] Compodoc auto-docs tab shows component API documentation
