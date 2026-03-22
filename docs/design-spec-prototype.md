# Prototype Design Spec Extension

> Extends the POC design spec (`design-spec.md`). Simulates what a real designer would produce at the POC→Prototype transition.

---

## Interaction States (all interactive elements)

| State | Treatment |
|-------|-----------|
| Default | As defined in POC design spec |
| Hover | Subtle background shift — buttons use `var(--p-primary-hover-color)`, cards get `box-shadow: 0 4px 12px rgba(0,0,0,0.15)` |
| Focus | 2px ring in primary color (`var(--p-primary-color)`), 2px offset, `outline-style: solid` |
| Active/Pressed | Slightly darker than hover — `var(--p-primary-active-color)` |
| Disabled | 50% opacity, `pointer-events: none`, no hover/focus treatment |

## Loading State Specs

### Stat Grid (Loading)
- 4 `p-skeleton` rectangles in responsive grid (matching stat card dimensions)
- Each skeleton: `width: 100%`, `height: 88px`, `borderRadius: 12px`
- Grid uses same responsive breakpoints as data state (1→2→3→4 columns)
- Animation: wave (PrimeNG default)

### Project Card Grid (Loading)
- 3 `p-skeleton` cards in responsive grid
- Each skeleton: `width: 100%`, `height: 180px`, `borderRadius: 12px`
- Grid: 1→2→3 columns at breakpoints

### Project Table (Loading)
- 1 `p-skeleton` header row: `width: 100%`, `height: 40px`
- 5 `p-skeleton` body rows: `width: 100%`, `height: 48px`, `marginBottom: 4px`
- Wrapped in table container with same border/radius as data state

## Empty State Spec

| Property | Value |
|----------|-------|
| Icon | `pi-inbox` at 48px, `var(--p-text-muted-color)` |
| Message | Centered, 16px, `var(--p-text-muted-color)` |
| Action | Optional primary button below message |
| Layout | Centered vertically in organism container, 48px padding |
| Examples | "No stats available", "No projects found", "No results for '[query]'" |

### Search-No-Results (distinct from Empty)
- Same layout as empty state
- Icon: `pi-search` at 48px
- Message: "No results for '[query]'" (includes the search term)
- Action: "Clear search" secondary outlined button

## Error State Spec

| Property | Value |
|----------|-------|
| Component | `p-message` with `severity="error"` |
| Copy pattern | "Unable to load [resource]. Please try again." |
| Retry button | Secondary outlined, below the message, 8px margin-top |
| Layout | Centered in organism container, 24px padding |
| Examples | "Unable to load stats", "Unable to load projects", "Project not found" |

## New Component Specs

### SearchBar (Molecule)
- Layout: horizontal flex, 8px gap
- Input: full width (`flex: 1`), placeholder "Search projects..."
- Button: "Search" label, primary severity
- Enter key in input triggers search
- Debounce: none at prototype (immediate filtering)

### FormField (Molecule)
- Layout: vertical stack, 4px gap
- Label: 12px, `var(--p-text-muted-color)`, uppercase, `letter-spacing: 0.05em`
- Content: `ng-content` slot below label
- Full-width variant: `width: 100%` on host

### EmptyState (Atom)
- Layout: centered flex column, 48px padding
- Icon: configurable PrimeIcons class, 48px, `var(--p-text-muted-color)`
- Message: 16px, `var(--p-text-muted-color)`, 8px below icon
- Action button: optional, primary severity, 16px below message

## Responsive Breakpoints (canonical, from POC)

| Name | Width | Stat Grid | Card Grid | Table |
|------|-------|-----------|-----------|-------|
| Mobile | < 640px | 1 col | 1 col | Horizontal scroll |
| Tablet | 640-1023px | 2 cols | 2 cols | Full width |
| Desktop | 1024-1439px | 3 cols | 3 cols | Full width |
| Wide | >= 1440px | 4 cols | 3 cols | Full width |
