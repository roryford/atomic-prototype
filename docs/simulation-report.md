# Atomic Design POC Simulation Report

## 1. Executive Summary

### What was simulated

An end-to-end proof-of-concept using Angular 21.2.3 and PrimeNG 21.1.3, covering:

- **3 pages:** Dashboard, List, Detail
- **3 atoms:** Button, Tag, InputText (thin wrappers around PrimeNG primitives)
- **1 molecule:** Stat Card (icon + value + label composition)
- **Design spec mapping:** a simulated Figma handoff with intentionally non-default values (Brand Indigo palette, Inter typography, custom spacing/radius) mapped to PrimeNG's `definePreset()` token system
- **4 risk spikes executed:** PrimeNG Fit (Spike 1), CSS Specificity / Theming (Spike 3), Bundle Size (Spike 5), and Responsive (Spike 2 via CSS Grid reflow)
- **1 risk spike N/A:** Third-Party Integration (Spike 4) was not applicable in a simulation context

### What was NOT simulated

- Real team dynamics (all "workers" were Claude instances operating from written instructions)
- Real Figma (a markdown design spec stood in for the Figma handoff)
- Storybook review (no visual review workflow was exercised)
- Designer-developer conversation (no back-and-forth on ambiguous specs)

### Finding counts by type

| Type | Count |
|------|-------|
| Contradiction | 5 |
| Ambiguous | 3 |
| Missing | 2 |
| Workflow gap | 4 |
| Confirmed works | 4 |
| **Total** | **18** |

---

## 2. Hypothesis Results

### H1: Can a developer scaffold and configure PrimeNG using only docs 03 and 08?

**Answer: No.** Multiple gaps were found:

- Doc 08's `app.config.ts` example shows `provideZonelessChangeDetection()`, but Angular 21 generates `provideBrowserGlobalErrorListeners()` instead. Copying doc 08 verbatim produces an incorrect config.
- `@angular/animations` is required for `provideAnimationsAsync()` but is not installed by the scaffold and not mentioned in the docs. Build fails until manually installed.
- PrimeNG import style (standalone `Button` vs module `ButtonModule`) is not specified. Both work, but the docs should pick one.
- File naming and class naming conventions in the docs (`.component.ts`, `FooComponent`) differ from Angular 21 defaults (`.ts`, `Foo`).

### H2: Do the code samples in docs 08 and 09 compile against current Angular/PrimeNG?

**Answer: No.** Three categories of breakage:

- **Naming:** Doc 08 uses legacy `.component.ts` file suffixes and `Component` class suffixes. Angular 21 generates without them.
- **Imports:** Doc 08/09 show `ButtonModule` imports. PrimeNG 21 supports standalone imports (`Button` from `'primeng/button'`), which is the modern pattern.
- **Providers:** Doc 08's `provideZonelessChangeDetection()` is not what Angular 21 generates. `provideBrowserGlobalErrorListeners()` is new and undocumented in the process docs.

### H3: Does definePreset() cover theming needs?

**Answer: Approximately 80%.** The four gap categories requiring escape hatches are:

1. **Table header text formatting** (uppercase, letter-spacing, font-size, font-weight) — no tokens exist for these; requires `pt` API or CSS.
2. **Card border** — Aura base theme does not expose a card border token; requires CSS override.
3. **Font family** — `fontFamily` has no semantic token slot; must be set via global CSS (`body { font-family: Inter, ... }`).
4. **Button default font size** — only `sm` and `lg` sub-objects expose `fontSize`; default size requires CSS override.

No `!important` or `::ng-deep` was required for any escape hatch.

### H4: Is the atomic hierarchy clear enough to decompose without ambiguity?

**Answer: Mostly.** Two ambiguities surfaced:

- **Severity type narrowing:** PrimeNG's Button and Tag use union-type severity props (`'success' | 'info' | 'warn' | 'danger'`). A naive `input<string>()` in an atom wrapper fails type-checking. The docs do not mention this — developers must import `ButtonSeverity` or re-declare the union type.
- **"Thin wrapper" depth:** Doc 01 says atoms should be thin wrappers but does not specify whether every PrimeNG input should be re-exposed, or only the ones the design system uses. This is the key architectural decision and it is left unstated.

### H5: What is the production bundle size baseline?

**Answer: 1.06 MB raw / 206 KB gzipped.**

- The app imports 7 PrimeNG components but the production bundle contains 24 component selectors, including 11 never directly imported (`p-badge`, `p-checkbox`, `p-datepicker`, `p-dialog`, `p-dropdown`, `p-paginator`, `p-radiobutton`, `p-select`, `p-tooltip`, `p-tree`, `p-treetable`).
- `TableModule` is the primary culprit, pulling in a large transitive dependency graph.
- The 1.06 MB raw total exceeds Angular's default 500 KB warning threshold by 2x for a 3-page, 7-component app.

### H6: Are the risk spike instructions actionable?

**Answer: Yes for Spikes 1, 3, and 5.** Spike 4 was N/A. The one unexpected issue was the `pt` API naming inconsistency: `definePreset` uses `headerCell` for datatable token paths, but the `pt` API uses `thead`. This divergence is not documented and caused a failed first attempt.

---

## 3. Risk Spike Results

### 3.1 PrimeNG Fit (Spike 1)

`definePreset()` covers approximately 80% of the design spec. Full coverage table:

| Design Spec Property | definePreset Token Path | Works? | Escape Hatch? |
|---|---|---|---|
| Button primary bg `#4338CA` | `components.button.root.primary.background` | Yes | No |
| Button primary hover `#6366F1` | `components.button.root.primary.hoverBackground` | Yes | No |
| Button primary text `#FFFFFF` | `components.button.root.primary.color` | Yes | No |
| Button secondary bg transparent | `components.button.root.secondary.background` | Yes | No |
| Button secondary border `#4338CA` | `components.button.root.secondary.borderColor` | Yes | No |
| Button danger bg `#DC2626` | `components.button.root.danger.background` | Yes | No |
| Button border radius 6px | `components.button.root.borderRadius` | Yes | No |
| Button padding 8px 16px | `components.button.root.paddingX/paddingY` | Yes | No |
| Button font weight 600 | `components.button.root.label.fontWeight` | Yes | No |
| Button font size 14px | No root-level fontSize token | **No** | CSS override |
| Tag border radius 9999px | `components.tag.root.borderRadius` | Yes | No |
| Tag font size 12px | `components.tag.root.fontSize` | Yes | No |
| Tag font weight 600 | `components.tag.root.fontWeight` | Yes | No |
| Tag padding 2px 10px | `components.tag.root.padding` | Yes | No |
| Tag severity bg/color (all 4) | `components.tag.[severity].background/color` | Yes | No |
| Table header bg `#F5F5F4` | `components.datatable.headerCell.background` | Yes | No |
| Table header text `#1C1917` | `components.datatable.headerCell.color` | Yes | No |
| Table header uppercase | No token for text-transform | **No** | `pt` API or CSS |
| Table header font 12px/600 | No headerCell fontSize/fontWeight token | **No** | `pt` API or CSS |
| Table row hover `#FAFAF9` | `components.datatable.row.hoverBackground` | Yes | No |
| Table row border `#E7E5E4` | `components.datatable.bodyCell.borderColor` | Yes | No |
| Table cell padding 12px 16px | No bodyCell padding token | **Partial** | CSS override |
| Card background `#FFFFFF` | `components.card.root.background` | Yes | No |
| Card border 1px solid `#E7E5E4` | No card border token | **No** | CSS |
| Card border radius 12px | `components.card.root.borderRadius` | Yes | No |
| Card padding 24px | `components.card.body.padding` | Yes | No |
| Card shadow | `components.card.root.shadow` | Yes | No |
| Font family Inter | No fontFamily semantic token | **No** | Global CSS |

**Gap categories:** (1) text formatting tokens, (2) card border, (3) font family, (4) button default font size. All escape hatches are minor — no `!important` or `::ng-deep` required.

**pt API finding:** The passthrough API key names diverge from `definePreset` token names. `definePreset` uses `headerCell` for datatable styling; the `pt` API uses `thead`. The Table component's pt interface exposes structural elements (`thead`, `tbody`, `table`, `root`) but not cell-level keys like `headerCell`.

### 3.2 Responsive (Spike 2)

**Approach:** CSS Grid reflow at three breakpoints.

| Breakpoint | Width | Columns |
|---|---|---|
| Mobile | < 640px | 1 |
| Tablet | 640px - 1023px | 2 |
| Desktop | 1024px - 1439px | 3 |
| Wide | >= 1440px | 4 |

Dashboard stat cards reflow from 4-column to 1-column. List table gets horizontal scroll on mobile. Detail form stacks fields vertically. Same DOM structure at all breakpoints — no restructure needed for the POC screens.

**Open question for real team:** Breakpoint values are inconsistent across the docs. The design spec uses 640/1024/1440. Doc 04 references 320/768/1024/1440/1920. The team should establish one canonical set.

### 3.3 CSS Specificity / Dark Mode (Spike 3)

**What works:**

- Dark mode via `colorScheme.dark` in the preset + `darkModeSelector: '.dark-mode'` in `providePrimeNG()` options. Toggle via `document.documentElement.classList.toggle('dark-mode')`.
- Nested component cascade (Card containing Label, InputText, Button, Tags) responds correctly to the dark mode toggle. All PrimeNG components consume CSS custom properties (`--p-surface-*`, `--p-primary-*`, `--p-text-*`) that are redefined under `.dark-mode`.
- No `!important` declarations or `::ng-deep` pseudo-selectors were needed anywhere.

**Primary gotcha:** Hard-coded hex values in component styles do NOT respond to the dark mode toggle. A dashboard using `background: #FAFAF9` instead of `background: var(--p-surface-50)` breaks dark mode. The rule: always use `var(--p-*)` custom properties, never hard-code hex values in component styles.

### 3.4 Third-Party Integration (Spike 4)

**N/A for simulation.** No real third-party libraries were integrated.

**What the real team should do:** During Week 1, identify any non-PrimeNG dependencies (charting libraries, date pickers, rich text editors) and spike their CSS interaction with the PrimeNG theme layer. The key question is whether third-party component styles conflict with PrimeNG's CSS custom property system.

### 3.5 Bundle Size (Spike 5)

| Chunk | Raw Size | Gzipped |
|---|---|---|
| `main-KZP5GOFU.js` | 880.0 kB | 156.1 kB |
| `chunk-QDVIZUXI.js` | 164.6 kB | 47.5 kB |
| `styles-Q27L7E7A.css` | 13.2 kB | 2.4 kB |
| **Initial total** | **1.06 MB** | **206.0 kB** |
| `chunk-P4WDW5VC.js` (lazy) | 67.8 kB | 17.8 kB |

**TableModule concern:** 7 components imported, but 24 component selectors present in the bundle. 11 unused components are pulled in transitively by `TableModule` (`p-badge`, `p-checkbox`, `p-datepicker`, `p-dialog`, `p-dropdown`, `p-paginator`, `p-radiobutton`, `p-select`, `p-tooltip`, `p-tree`, `p-treetable`). The `@primeuix/themes` Aura preset also embeds style definitions for every bundled component.

**Budget recommendation:**

| Metric | Warning | Error |
|---|---|---|
| Raw size | 1.2 MB | 1.5 MB |
| Gzipped transfer | 250 KB | — |

Current 206 KB gzipped leaves ~20% headroom. For production beyond POC, investigate replacing `TableModule` with standalone `Table` import if available, or lazy-loading pages that use Table.

---

## 4. Documentation Gaps

### 4.1 Missing Information

- **`@angular/animations` dependency:** Adding `provideAnimationsAsync()` requires `@angular/animations` as a separate install. The Angular 21 scaffold does not include it. Build fails with "Could not resolve @angular/animations/browser" until manually installed.
- **`fontFamily` has no token slot:** PrimeNG's `Semantic` type does not include a `fontFamily` property. Must be set via global CSS. Docs do not mention this limitation.
- **Button `fontSize` not a root token:** The default button size has no root-level `fontSize` token. Only `sm` and `lg` sub-objects expose it. `fontWeight` maps to `root.label.fontWeight`, not `root.fontWeight`.
- **PrimeNG import style not specified:** Docs show `imports: [ButtonModule]`. PrimeNG 21 supports standalone imports (`import { Button } from 'primeng/button'`). Standalone is cleaner for atoms; module may still be needed for complex organism primitives like Table.

### 4.2 Ambiguities

- **Token nesting hierarchy undocumented:** The design spec provides flat intent names but doc 03 does not explain PrimeNG's actual token nesting. For example, button tokens require `root.primary.background` (not `colorScheme.light.primary.background`), tag tokens use top-level `success.background` (not nested in `colorScheme`). The only way to discover correct paths was reading `@primeuix/themes/types` d.ts files. A token path cheat-sheet is needed.
- **"Thin wrapper" depth unclear:** Doc 01 says atoms should be thin wrappers but does not specify whether to re-expose every PrimeNG input or only the ones the design system uses.
- **Severity type narrowing not mentioned:** PrimeNG's Button and Tag use union-type severity props. A naive `input<string>()` in atom wrappers fails type-checking. Developers must import `ButtonSeverity` or re-declare the type.

### 4.3 Contradictions

- **File naming:** Doc 08 uses legacy `.component.ts` suffixes throughout. Angular 21 generates `.ts` files by default (2025 convention). No `--file-naming=legacy` flag exists.
- **`app.config.ts` structure:** Doc 08 shows `provideZonelessChangeDetection()`. Angular 21 generates `provideBrowserGlobalErrorListeners()` instead — zoneless is the default.
- **Version pinning:** Doc 02 pins Angular 21.2.5 and PrimeNG 21.1.1. Actual installs yielded Angular 21.2.3 and PrimeNG 21.1.3. `@primeng/themes` installed as 21.0.4 (different minor). Exact pins create false precision.
- **Component class naming:** Doc 08 mandates `Component` suffix (`SearchBarComponent`). Angular 21 generates without it (`SmokeTest`, `App`).

### 4.4 Workflow Gaps

- **`pt` API key names diverge from `definePreset` token names:** `definePreset` uses `headerCell` for datatable styling, but the `pt` API uses `thead`. Developers will attempt `pt.headerCell` and get a TS2353 error.
- **Hard-coded hex values break dark mode:** Any component style using hex values instead of `var(--p-*)` custom properties will not respond to dark mode toggle. This is the primary theming gotcha.
- **No guidance for solo developer or simulation scenario:** The docs assume a multi-person team. A solo developer or simulation has no way to distinguish roles.
- **Breakpoint values inconsistent across docs:** Design spec uses 640/1024/1440. Doc 04 references 320/768/1024/1440/1920. No single canonical set.

---

## 5. Component Decomposition Learnings

- **Atom wrappers were straightforward** once the severity type narrowing issue was solved. The pattern is clear: wrap a PrimeNG primitive, expose a curated subset of inputs, apply the design system's conventions as defaults.
- **The cascade rule works in practice.** Primitive tokens flow to semantic tokens, which flow to component tokens. `definePreset(Aura, {...})` merges cleanly with the base theme.
- **The key ambiguity is "how much to re-expose."** A Button atom could expose 3 inputs (label, severity, disabled) or 15. The docs do not provide a principle for deciding. This decision affects every atom and should be settled in Week 1.
- **POC structure contradiction:** Doc 08's POC folder structure does not include an `atoms/` folder, but the atomic decomposition practice requires one. The POC folder structure and the atomic hierarchy are in tension — this is itself a finding.

---

## 6. Token Mapping Learnings

- **Design-spec to `definePreset()` requires knowledge of PrimeNG's internal token hierarchy.** The three tiers (primitive, semantic, component) are conceptually clear, but the actual nesting paths are not intuitive. `root.primary.background` vs `colorScheme.light.primary.background` vs top-level `success.background` follow different patterns for different components.
- **`colorScheme` nesting worked**, but only because Worker C read TypeScript type definitions in `@primeuix/themes/types`. A developer relying solely on the process docs would not discover the correct paths.
- **Doc 03 needs a cheat-sheet:** "To set button primary color, use `components.button.root.primary.background`. To set tag success color, use `components.tag.success.background`." This reference table is the single highest-value addition.
- **The 3-tier concept is sound but the implementation details are not documented.** The cascade rule, the concept of primitive/semantic/component tokens, and the `definePreset()` merge behavior all work as described. The gap is entirely in the specific token paths.

---

## 7. Recommendations

### For the Process Docs

1. **Update docs 08 and 09 for Angular 21 conventions.** Switch to 2025 file naming (`.ts` not `.component.ts`), drop the `Component` class suffix, replace `provideZonelessChangeDetection()` with current Angular 21 defaults, and note `provideBrowserGlobalErrorListeners()`.
2. **Add a token path cheat-sheet to doc 03.** Map every design intent (button colors, tag severities, table headers, card properties) to its exact `definePreset()` path. This is the highest-impact documentation improvement.
3. **Note `@angular/animations` dependency in doc 08.** Call out that it must be installed separately: `npm install @angular/animations`.
4. **Clarify standalone vs module imports.** Recommend standalone imports for atoms (`import { Button } from 'primeng/button'`) and note that `TableModule` is still needed for complex table features.
5. **Add dark mode CSS custom property guidance.** State the rule explicitly: never hard-code hex values in component styles; always use `var(--p-*)` tokens.
6. **Use version ranges instead of exact pins in doc 02.** Say "PrimeNG 21.x" and "Angular 21.x" instead of pinning to versions that may not exist.

### For the Real Team's Week 1

1. **Settle file naming convention** (2025 vs legacy) before writing any code. Mixed naming in the same project will cause confusion and inconsistent imports.
2. **Spike `definePreset()` with the actual design early.** The token path discovery process is the hardest part of theming. Do it in the first two days, not the last two.
3. **Establish a rule: never hard-code hex values in component styles.** Always use `var(--p-*)` custom properties. This is non-negotiable for dark mode support.
4. **Discuss `TableModule`'s bundle weight.** Decide whether lazy loading is needed from day 1, or whether the POC can accept the 1.06 MB initial bundle.

### For the Real POC

- **Bundle budget:** 1.2 MB raw warning / 1.5 MB raw error (POC phase). 250 KB gzipped transfer ceiling.
- **Lazy-load at least the list/detail routes** to keep initial load manageable. The lazy chunk mechanism works (67.8 kB chunk confirmed in the build output).
- **The `pt` API is viable** but key names differ from `definePreset` token names. Document the mapping explicitly (e.g., `definePreset` `headerCell` = `pt` `thead`).
- **Plan for 80% `definePreset()` coverage + 20% CSS/pt overrides.** This ratio held consistently across all four component types in the design spec. It is a reasonable expectation for any PrimeNG-based design system.
