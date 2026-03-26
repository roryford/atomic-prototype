# 05 - Token Pipeline

> **When to read:** When you need to set up or modify the design token pipeline. Developers read this early. Designers should read sections 1-3. Read time: ~10 minutes.

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

> **Dark mode rule:** Always use CSS custom properties, not hardcoded hex. See [§ 4. Dark Mode](#4-dark-mode) below for the full guide.

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

## 4. Dark Mode

This section is the single reference for how dark mode works in this stack. Other docs reference it — if you're looking for dark mode guidance, you're in the right place.

### How It Works

PrimeNG's `definePreset()` accepts a `colorScheme.dark` block alongside `colorScheme.light`. When the CSS class `.dark-mode` is present on the `<html>` element, PrimeNG swaps the underlying CSS custom property values automatically. No `!important` overrides needed — nested components cascade correctly.

```ts
// In definePreset() — semantic tier
semantic: {
  colorScheme: {
    light: { primary: { color: '{blue.500}' }, surface: { 0: '#FFFFFF' } },
    dark:  { primary: { color: '{blue.400}' }, surface: { 0: '#0C0A09' } }
  }
}
```

```ts
// In app.config.ts — tells PrimeNG which CSS class activates dark mode
// Must use '.dark-mode' (class selector with leading dot).
// PrimeNG generates: .dark-mode:root { vars } which correctly targets <html class="dark-mode">.
// Do NOT use 'html.dark-mode' — PrimeNG treats it as a custom selector and generates
// nested CSS that creates an impossible html.dark-mode :root rule.
providePrimeNG({ theme: { preset: CustomPreset, options: { darkModeSelector: '.dark-mode' } } })
```

```ts
// Toggle in a component
document.documentElement.classList.toggle('dark-mode');
```

See the working implementation at [`src/app/design-system/tokens/preset.ts`](../src/app/design-system/tokens/preset.ts) and [`src/app/app.config.ts`](../src/app/app.config.ts).

### The #1 Rule

**Always use CSS custom properties for colors.** Any hardcoded hex value (`background: #FAFAF9`) stays the same in both modes — it does not respond to the dark mode toggle. Use `var(--p-surface-50)`, `var(--p-text-color)`, etc. instead. This is the most common theming mistake and was found in 11 places during the prototype simulation.

Stylelint's `color-no-hex` rule catches this in `.scss`/`.css` files, but cannot inspect inline `styles:` arrays in TypeScript decorators or `[style]` template bindings. A pre-commit grep or custom ESLint rule is needed for full coverage.

### Toggle Strategy (team decision)

The prototype uses a manual toggle button in the nav bar. A real team should decide:

- **Manual toggle only** — user clicks a button, preference stored in localStorage
- **OS preference only** — `prefers-color-scheme: dark` media query, no user control
- **Both** — OS preference as default, manual toggle to override, preference persisted

PrimeNG's `darkModeSelector` supports any CSS selector. For OS preference, use `darkModeSelector: 'system'` (PrimeNG 21+). For manual, use a class like `.dark-mode`.

### The Hard Part: `colorScheme` Nesting

Flat DTCG semantic tokens (e.g., `semantic/primary/color`) must be transformed into PrimeNG's nested `colorScheme.light` / `colorScheme.dark` structure. This is the single hardest mapping in the token pipeline — your custom Style Dictionary format or script must handle it explicitly.

If using **Path B (PrimeOne UI Kit v4)**, light and dark values are defined as Figma Variable modes — both `colorScheme.light` and `colorScheme.dark` are generated automatically from a single source, eliminating manual dark-mode token mapping.

### Risk: Nested Component Overrides

Themed components composed inside other themed components (a button inside a card inside a dialog) can leak styles in dark mode. Spike this early: build one screen with nested overrides in both light and dark mode. If overrides compose cleanly, the strategy works. If not, change it before it propagates. See [10-derisking](./10-derisking.md) for the full risk checklist.

### What This Prototype Is Missing

The dark palette in this prototype was developer-invented — no designer specified the `colorScheme.dark` values. For production:

- A designer should specify the dark palette (or use PrimeOne UI Kit which generates both modes)
- Automated visual verification is needed (Chromatic Modes or Playwright theme-toggle snapshots)
- The toggle strategy should be decided and documented

See [production-plan-sketch](./production-plan-sketch.md) for the full production readiness discussion.

---

## 5. Composite Tokens

Typography tokens in DTCG are composite — a single token bundles `fontFamily`, `fontSize`, `fontWeight`, and `lineHeight`. Style Dictionary handles these via expansion transforms (`expand: true` in config), but this requires explicit configuration. If you use a custom script instead, you need to destructure composites yourself.

## 6. Which Output Goes Where

| Output file | Where it's used | Purpose |
|-------------|----------------|---------|
| `_variables.scss` | `@use` in component SCSS | Atom-level styling overrides (spacing, radii, colors as SCSS vars) |
| `preset.ts` | `app.config.ts` via `providePrimeNG()` | Global PrimeNG theme — injected as CSS custom properties on `:root` |
| `tokens.ts` | Runtime TypeScript imports | Direct access to token values in logic (rare — most styling is CSS-driven) |

---

## Cross-References

- For tooling options and version guidance, see [06-tooling-landscape.md](./06-tooling-landscape.md).
- For token gap risks and mitigation strategies, see [10-derisking.md](./10-derisking.md).

## See It in Code

The working preset is at [`src/app/design-system/tokens/preset.ts`](../src/app/design-system/tokens/preset.ts).
