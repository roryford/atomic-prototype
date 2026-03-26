# Simulated Figma Design Spec — POC Handoff

> **Simulation note:** This file simulates a designer sharing visual values from Figma.
> These values are intentionally different from PrimeNG Aura defaults to force the
> developer to practice the token mapping workflow described in [05-token-pipeline](./05-token-pipeline.md).

---

## Color Palette

| Name | Hex | Intent |
|------|-----|--------|
| Brand Indigo | `#4338CA` | Primary actions, active states, links |
| Brand Indigo Light | `#6366F1` | Hover states, secondary emphasis |
| Brand Indigo Dark | `#3730A3` | Pressed states, dark mode primary |
| Surface Warm | `#FAFAF9` | Page background |
| Surface Card | `#FFFFFF` | Card/panel backgrounds |
| Surface Muted | `#F5F5F4` | Disabled backgrounds, table stripes |
| Text Primary | `#1C1917` | Headings, body text |
| Text Secondary | `#78716C` | Captions, helper text |
| Danger Red | `#DC2626` | Error states, destructive actions |
| Success Green | `#16A34A` | Success states, positive indicators |
| Warning Amber | `#D97706` | Warning states, attention needed |

## Typography

| Tier | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Heading | Inter | 24px | 700 | 32px |
| Subheading | Inter | 18px | 600 | 28px |
| Body | Inter | 14px | 400 | 22px |
| Caption | Inter | 12px | 400 | 18px |

## Spacing

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

## Border Radius

| Token | Value |
|-------|-------|
| default | 6px |
| rounded | 12px |
| pill | 9999px |

## Component Specs

### Button
- Border radius: 6px (default)
- Primary: bg `#4338CA`, text `#FFFFFF`, hover bg `#6366F1`
- Secondary: bg transparent, border `#4338CA`, text `#4338CA`
- Danger: bg `#DC2626`, text `#FFFFFF`, hover bg `#B91C1C`
- Padding: 8px 16px (sm md)
- Font: 14px / 600

### Tag
- Border radius: 9999px (pill)
- Success: bg `#DCFCE7`, text `#16A34A`
- Warning: bg `#FEF3C7`, text `#D97706`
- Danger: bg `#FEE2E2`, text `#DC2626`
- Info: bg `#E0E7FF`, text `#4338CA`
- Font: 12px / 600
- Padding: 2px 10px

### Table
- Header bg: `#F5F5F4` (Surface Muted)
- Header text: `#1C1917` / 12px / 600 / uppercase
- Row hover: `#FAFAF9` (Surface Warm)
- Row border: 1px solid `#E7E5E4`
- Cell padding: 12px 16px

### Card
- Background: `#FFFFFF` (Surface Card)
- Border: 1px solid `#E7E5E4`
- Border radius: 12px (rounded)
- Padding: 24px (lg)
- Shadow: 0 1px 3px rgba(0,0,0,0.1)

### Stat Card (KPI)
- Icon: 32px, Brand Indigo
- Value: 24px / 700 / Text Primary
- Label: 12px / 400 / Text Secondary
- Layout: icon left, value + label stacked right

## Responsive Breakpoints

| Name | Width | Columns |
|------|-------|---------|
| Mobile | < 640px | 1 |
| Tablet | 640px - 1023px | 2 |
| Desktop | 1024px - 1439px | 3 |
| Wide | >= 1440px | 4 |

---

## Prototype Phase Extensions

> Added at the POC → Prototype transition. Covers interaction states, loading/error/empty specs, and new components not in the original POC handoff.

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

## Responsive Breakpoints (expanded for prototype)

| Name | Width | Stat Grid | Card Grid | Table |
|------|-------|-----------|-----------|-------|
| Mobile | < 640px | 1 col | 1 col | Horizontal scroll |
| Tablet | 640-1023px | 2 cols | 2 cols | Full width |
| Desktop | 1024-1439px | 3 cols | 3 cols | Full width |
| Wide | >= 1440px | 4 cols | 3 cols | Full width |
