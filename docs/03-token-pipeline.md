# 03 - Token Pipeline

> **Key question:** How do design tokens flow from Figma to Angular code — and what does that look like when you have zero tooling vs. a mature pipeline?

## 1. What Design Tokens Are and Why They Matter

Design tokens are named values (colors, spacing, radii, typography) that act as the bridge between Figma and code. When a designer changes `blue.500` in Figma, the token pipeline ensures that same change reaches the Angular app. Without tokens, design drift is inevitable — developers eyeball hex values, spacing diverges, and dark mode becomes a second codebase. Tokens make the design system a single source of truth. The question is not *whether* to use them, but how much automation the project justifies today.

## 2. The Pipeline (Three Paths)

### Path 1: Manual (POC, zero tooling)

The designer shares token values via the Figma inspect panel, screenshots, or a spreadsheet. The developer manually creates a `definePreset()` with approximate values.

```ts
// src/app/theme/preset.ts — eyeballed from Figma inspect panel
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const AppPreset = definePreset(Aura, {
  primitive: {
    blue: { 500: '#3B82F6', 600: '#2563EB' },
    neutral: { 100: '#F5F5F5', 700: '#404040' }
  },
  semantic: {
    colorScheme: {
      light: { primary: { color: '{blue.500}' } },
      dark:  { primary: { color: '{blue.600}' } }
    }
  }
});
```

**Works for:** POC with 10–20 tokens.
**Breaks down at:** 50+ tokens or frequent design changes — manual copy-paste becomes error-prone and slow.

### Path 2: Semi-Automated (Prototype)

Tokens Studio (free tier) reads/writes Figma Variables and exports DTCG-format JSON. The developer then transforms that JSON into the outputs the app needs.

Two sub-options:

1. **Style Dictionary** — the industry-standard token build tool. It reads DTCG JSON and generates multiple output formats in one pass. However, Style Dictionary does **not** ship a PrimeNG format. You must write a custom format (~50–100 lines of JS) that maps tokens into `definePreset()` structure. Key npm packages: `style-dictionary` (v5.3+), `@tokens-studio/sd-transforms` (bridges Tokens Studio output to SD), `@tokens-studio/dtcg-convert` (format converter).
2. **Custom script** — a simpler alternative. A 50–80 line Node script reads the exported JSON and writes `preset.ts` directly. Less general, but faster to stand up for a single target format.

Either way, the developer runs the transform manually (`npm run build:tokens`) after each export.

> **Figma Variables vs. Tokens Studio:** Figma Variables are what designers work with day-to-day inside Figma. Tokens Studio is a plugin that reads/writes those same Variables and adds export capability (DTCG JSON, sync to Git). They are sequential — not competing.

**Alternative: PrimeOne 4.0 + Theme Designer.** PrimeOne UI Kit v4 uses native Figma Variables (no Tokens Studio dependency) with built-in light/dark mode support. The PrimeUI Theme Generator plugin exports DTCG JSON and can generate ready-to-use preset code via a Theme Designer Extended license. A GitHub Action (`primefaces/figma-to-theme-code-generator`) enables CI automation. This path eliminates manual `colorScheme.dark` authoring — both light and dark tokens are generated from a single Figma source. Requires a paid license.

**Works for:** Prototype with 50–200 tokens.
**Breaks down at:** frequent cross-team token changes where manual export/build steps get forgotten.

### Path 3: Automated (Production)

- **Tokens Studio Pro (paid)** syncs token changes directly to a Git branch on save.
- **Tokens Studio free** can still work — the designer exports JSON, a developer pushes it to the repo manually.
- A CI pipeline (GitHub Actions, etc.) runs Style Dictionary on push, generates all outputs, and opens a PR for review.

**Works for:** Production with frequent token changes across multiple contributors.

## 3. PrimeNG's 3-Tier Token System

```
Primitive ──▶ Semantic ──▶ Component
(raw values)   (intent)     (per-widget overrides)
```

| Tier | Purpose | Example |
|------|---------|---------|
| **Primitive** | Raw palette values, not used directly in components | `blue.500 = #3B82F6` |
| **Semantic** | Intent-based aliases that reference primitives | `colorPrimary = {blue.500}` |
| **Component** | Per-component overrides that reference semantic tokens | `button.primaryBackground = {colorPrimary}` |

Designers work at the **primitive** and **semantic** tiers. Component tokens are typically derived automatically by PrimeNG's preset system, with manual overrides only where needed.

### Token Tier Mapping

| Figma Token | DTCG `$type` | PrimeNG Tier | Example Value |
|-------------|-------------|--------------|---------------|
| `blue.500` | `color` | Primitive | `#3B82F6` |
| `spacing.md` | `dimension` | Primitive | `1rem` |
| `colorPrimary` | `color` | Semantic | `{blue.500}` |
| `borderRadius.default` | `dimension` | Semantic | `{radius.md}` |
| `button.primaryBackground` | `color` | Component | `{colorPrimary}` |

> **Dark mode rule:** When writing component styles, always use CSS custom properties (`var(--p-surface-50)`, `var(--p-text-color)`) instead of hardcoded hex values. Hardcoded hex values will not respond to dark mode toggling via `colorScheme.dark`. This is the most common theming mistake.

### The Hard Part: `colorScheme` Nesting

PrimeNG's semantic tier uses `colorScheme.light` / `colorScheme.dark` nesting to handle dark mode. Flat DTCG semantic tokens (e.g., `semantic/primary/color`) must be transformed into this nested structure. This is the single hardest mapping in the pipeline — your custom Style Dictionary format or script must handle it explicitly.

### Token Path Quick Reference

| Design Intent | `definePreset()` Path | Notes |
|---|---|---|
| Button primary background | `components.button.root.primary.background` | |
| Button primary hover | `components.button.root.primary.hoverBackground` | |
| Button border radius | `components.button.root.borderRadius` | |
| Button font weight | `components.button.root.label.fontWeight` | Nested under `label` |
| Button default font size | — | No root token; use CSS override or `sm`/`lg` variants |
| Tag border radius | `components.tag.root.borderRadius` | |
| Tag severity colors | `components.tag.success.background`, `.color` | Also: `warn`, `danger`, `info` |
| Table header background | `components.datatable.headerCell.background` | |
| Table header text color | `components.datatable.headerCell.color` | |
| Table row hover | `components.datatable.row.hoverBackground` | |
| Table cell border | `components.datatable.bodyCell.borderColor` | |
| Card background | `components.card.root.background` | |
| Card border radius | `components.card.root.borderRadius` | |
| Card shadow | `components.card.root.shadow` | |
| Card border | — | No token; use CSS |
| Font family | — | No token; set via global CSS `body { font-family }` |
| Primary color | `semantic.colorScheme.light.primary.color` | |
| Surface colors | `semantic.colorScheme.light.surface.0` through `.950` | |
| Text color | `semantic.colorScheme.light.text.color` | |

### Passthrough (pt) API

For customizing the internal DOM elements of PrimeNG components (e.g., adding a class to a button's label `<span>`), use PrimeNG's `passthrough` (pt) API as the first-line mechanism — before reaching for CSS overrides. The pt API is type-safe and survives PrimeNG version upgrades better than deep CSS selectors.

> **Warning:** The `pt` API key names differ from `definePreset()` token names. For example, DataTable uses `headerCell` in definePreset but `thead` in the pt API. Check PrimeNG's TypeScript types (`TablePassThroughOptions`) for correct pt keys.

## 4. Composite Tokens

Typography tokens in DTCG are composite — a single token bundles `fontFamily`, `fontSize`, `fontWeight`, and `lineHeight`. Style Dictionary handles these via expansion transforms (`expand: true` in config), but this requires explicit configuration. If you use a custom script instead, you need to destructure composites yourself.

## 5. Which Output Goes Where

| Output file | Where it's used | Purpose |
|-------------|----------------|---------|
| `_variables.scss` | `@use` in component SCSS | Atom-level styling overrides (spacing, radii, colors as SCSS vars) |
| `preset.ts` | `app.config.ts` via `providePrimeNG()` | Global PrimeNG theme — injected as CSS custom properties on `:root` |
| `tokens.ts` | Runtime TypeScript imports | Direct access to token values in logic (rare — most styling is CSS-driven) |

---

## Cross-References

- For tooling options and version guidance, see [02 - Tooling Landscape](02-tooling-landscape.md).
- For token gap risks and mitigation strategies, see [07 - De-risking](07-derisking.md).
