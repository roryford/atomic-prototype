# Simulated Figma Design Spec — POC Handoff

> **Simulation note:** This file simulates a designer sharing visual values from Figma.
> These values are intentionally different from PrimeNG Aura defaults to force the
> developer to practice the token mapping workflow described in doc 03.

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
