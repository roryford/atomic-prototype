# Designer's Guide to the Angular Design System

> **When to read:** If you are a designer joining the team or collaborating on the design system. This guide is your entry point -- it curates the existing documentation from a design perspective and covers the topics that matter most to your workflow. Read time: ~15 minutes.

---

## Contents

1. [Designer's Quick Start](#1-designers-quick-start)
2. [Figma to Angular Mapping](#2-figma-to-angular-mapping)
3. [Design Constraint Matrix](#3-design-constraint-matrix)
4. [Token Quick Reference](#4-token-quick-reference)
5. [Dark Mode Design Process](#5-dark-mode-design-process)
6. [Requesting Component Features](#6-requesting-component-features)
7. [Storybook as a Design Tool](#7-storybook-as-a-design-tool)

---

## 1. Designer's Quick Start

### Your reading path

Not every doc in this repo is meant for you. Here is the order that matters, with notes on what to focus on:

| Order | Doc | What to focus on | Skip |
|-------|-----|------------------|------|
| 1 | [00-quickstart](./00-quickstart.md) | Orientation, 2 min | Nothing |
| 2 | [01-atomic-hierarchy](./01-atomic-hierarchy.md) | Level definitions, the cascade rule, the component tables | Code examples, severity type narrowing, wrapper input depth |
| 3 | This guide | Everything | -- |
| 4 | [05-token-pipeline](./05-token-pipeline.md) | Sections 1-3: what tokens are, the 3-tier system, the token path quick reference | Style Dictionary config, CI pipeline setup |
| 5 | [04-parallel-development](./04-parallel-development.md) | Early alignment, ongoing practices, Storybook review, feedback patterns | API shape co-design, bundle awareness |
| 6 | [design-spec](./design-spec.md) | The full simulated Figma handoff -- this is what your deliverable should look like | -- |
| 7 | [component-catalogue](./component-catalogue.md) | Visual reference for every built component | -- |

### What you do not need

- [03-project-structure](./03-project-structure.md) -- file naming and folder layout, developer-only
- [09-angular-direction](./09-angular-direction.md) -- Angular framework decisions
- [11-implementation-tips](./11-implementation-tips.md) -- coding gotchas
- [07-qa-per-atomic-level](./07-qa-per-atomic-level.md) -- testing criteria (skim if you want to understand certification)

### Your deliverables at each maturity stage

| Stage | What the team needs from you |
|-------|------------------------------|
| **POC** | Color palette, typography scale, spacing scale, border radii. A rough layout for the primary screen. See [design-spec](./design-spec.md) for the format. |
| **Prototype** | Interaction states (hover, focus, disabled), loading/error/empty specs per organism, responsive behavior, new molecule specs. See the "Prototype Phase Extensions" section of [design-spec](./design-spec.md). |
| **Production** | Dark mode palette, finalized token set, accessibility review (contrast ratios, focus indicators), edge-case states (long text, truncation, overflow). |

For more on maturity stages, see [02-maturity-stages](./02-maturity-stages.md).

---

## 2. Figma to Angular Mapping

### How Figma components map to atomic levels

The design system uses Brad Frost's atomic design hierarchy. Your Figma components should mirror these levels:

| Atomic Level | What it is | Figma equivalent |
|--------------|-----------|------------------|
| **Atom** | A single UI element (button, input, tag, badge) | A base component in your Figma library |
| **Molecule** | 2-4 atoms composed together (search bar = input + button) | A component that nests other base components |
| **Organism** | A self-contained section with real data (data table, card grid, stat grid) | A larger frame that represents a full UI section |
| **Template** | A page layout with empty slots, no real content | A Figma frame showing grid structure with placeholder regions |
| **Page** | A template filled with real data | A complete Figma mockup with realistic content |

For the full definitions with concrete examples, see [01-atomic-hierarchy](./01-atomic-hierarchy.md).

### Naming conventions

Figma component names should match Angular selector names where practical. The design system uses a `ds-` prefix:

| Figma component name | Angular selector | Angular class |
|---------------------|-----------------|---------------|
| DS / Button | `ds-button` | `DsButton` |
| DS / Tag | `ds-tag` | `DsTag` |
| DS / Stat Card | `ds-stat-card` | `DsStatCard` |
| DS / Search Bar | `ds-search-bar` | `DsSearchBar` |
| DS / Project Table | `ds-project-table` | `DsProjectTable` |

Use a "DS /" prefix in Figma to group design system components together. The exact Figma naming structure (slashes, nesting) is up to you, but the component name after the prefix should match the Angular selector minus the `ds-` prefix.

### The handoff flow

1. **You design** a component in Figma using your token variables (colors, spacing, typography from the shared library).
2. **You share** the spec values -- either via the Figma inspect panel, a spec document like [design-spec](./design-spec.md), or through Tokens Studio export.
3. **The developer** maps your tokens into the Angular preset file and builds the component. See [05-token-pipeline](./05-token-pipeline.md) for the three pipeline paths (manual, semi-automated, automated).
4. **You review** the built component in Storybook, comparing it side-by-side with your Figma design. See [section 7](#7-storybook-as-a-design-tool) below.
5. **You flag** any differences. On a small team, this is a conversation, not a ticket. See [04-parallel-development](./04-parallel-development.md) for feedback patterns.

### What to include in a handoff

At minimum, every component spec should include:

- Color values (hex or token names)
- Spacing values (padding, margin, gap)
- Typography (font, size, weight, line height)
- Border radius
- States (default, hover, focus, active, disabled)
- Responsive behavior at each breakpoint (mobile, tablet, desktop, wide)

At prototype maturity, also include: loading skeleton dimensions, empty state layout, and error state patterns. See the "Prototype Phase Extensions" in [design-spec](./design-spec.md) for examples of each.

---

## 3. Design Constraint Matrix

The design system is built on PrimeNG, a component library for Angular. PrimeNG provides a theming layer that makes many visual changes straightforward -- but not everything. Understanding these boundaries upfront prevents designing things that require expensive workarounds.

### Can do freely (token changes only)

These changes are applied by updating token values. No developer involvement beyond running the token build. Turnaround: minutes.

| Category | What you can change | How |
|----------|-------------------|-----|
| **Colors** | Primary, secondary, danger, success, warning palette; surface shades; text colors | Update primitive and semantic tokens |
| **Border radius** | Any component's corner rounding | Update component-tier token (e.g., button, card, tag) |
| **Spacing** | Component internal padding | Update component-tier padding tokens |
| **Typography weight** | Font weight on buttons, tags, labels | Update component-tier font weight token |
| **Card shadow** | Box shadow depth and spread | Update card shadow token |
| **Tag shape** | Pill vs. rounded vs. square tags | Update tag border radius token |

For the full list of available token paths, see the **Token Path Quick Reference** table in [05-token-pipeline](./05-token-pipeline.md#token-path-quick-reference).

### Requires developer work (CSS or template changes)

These changes need a developer to write custom CSS or modify component templates. Turnaround: hours to a day.

| Category | What you want | Why it needs dev work |
|----------|--------------|----------------------|
| **Icon buttons** | A button with only an icon, no label | Needs a new atom variant or input |
| **Custom layouts** | Non-standard arrangement of elements within a molecule | Requires template modification |
| **New component variants** | e.g., a "compact" stat card, a "large" button | Needs new inputs and conditional styling |
| **Custom empty/error states** | Different layout or illustration per organism | Requires template and possibly new atoms |
| **Table cell formatting** | Custom cell content (progress bars, inline actions) | Requires `pTemplate` configuration at organism level |
| **Font family** | Changing the typeface globally | No token exists; requires a global CSS change |

### Cannot do without significant workarounds

These bump against PrimeNG's architecture. Discuss with the team before designing around them.

| Category | The limitation | Why |
|----------|---------------|-----|
| **DataTable header font properties** | Limited control over individual header cell typography beyond weight and color | PrimeNG's DataTable header tokens cover background and color but not granular per-column font control |
| **Button default font size** | No root-level font size token for buttons | PrimeNG provides `sm` and `lg` size variants but no token for the default size; requires CSS override |
| **Card border** | No token for card border style or width | Must use CSS override; the token system only covers shadow and radius |
| **Component internal DOM** | Reordering or restructuring elements inside a PrimeNG component | PrimeNG controls its own internal HTML; the passthrough (pt) API allows adding classes but not restructuring |
| **Animation/transition** | Custom enter/exit animations on PrimeNG overlays | PrimeNG manages its own animation lifecycle |

When in doubt, ask: "Can this be achieved by changing a token value?" If yes, it is easy. If not, check with the developer before investing design time.

---

## 4. Token Quick Reference

Design tokens are named values that bridge your Figma file and the Angular code. When you change a token in Figma, the same change reaches the app through the token pipeline (see [05-token-pipeline](./05-token-pipeline.md) for the technical details).

The system uses three tiers of tokens. As a designer, you primarily work with the first two:

| Tier | Your role | Example |
|------|----------|---------|
| **Primitive** | Define the raw palette | `indigo.500 = #4338CA` |
| **Semantic** | Assign intent to primitives | `primary.color = indigo.500` |
| **Component** | Usually leave to developers | `button.borderRadius = 6px` |

### Available token categories

| Category | What it controls | Examples from this project | Where you see it |
|----------|-----------------|---------------------------|------------------|
| **Color -- brand** | Primary actions, links, active states | Indigo 500 (#4338CA), Indigo 400 (#6366F1), Indigo 600 (#3730A3) | Buttons, links, focus rings, active nav items |
| **Color -- semantic** | Status communication | Red 500 (#DC2626), Green 500 (#16A34A), Amber 500 (#D97706) | Tags, error messages, success indicators |
| **Color -- surface** | Backgrounds, panels, stripes | Stone 50 (#FAFAF9), Stone 100 (#F5F5F4), White (#FFFFFF) | Page background, card backgrounds, table headers, disabled states |
| **Color -- text** | Readability hierarchy | Stone 900 (#1C1917), Stone 500 (#78716C) | Headings, body copy, captions, helper text |
| **Spacing** | Padding, margins, gaps | xs (4px), sm (8px), md (16px), lg (24px), xl (32px) | Component internal padding, grid gaps, form field spacing |
| **Typography** | Font size, weight, line height | Heading (24/700/32), Body (14/400/22), Caption (12/400/18) | All text content |
| **Border radius** | Corner rounding | default (6px), rounded (12px), pill (9999px) | Buttons (6px), cards (12px), tags (pill) |
| **Shadow** | Depth and elevation | `0 1px 3px rgba(0,0,0,0.1)` | Cards, hover states |
| **Border** | Dividing lines, outlines | Stone 200 (#E7E5E4) for 1px solid borders | Table rows, card borders, input outlines |

### How tokens cascade

A single token change can ripple across the entire system. This is the key advantage:

```
Change indigo.500 (primitive)
  --> primary.color updates (semantic)
    --> every button, link, focus ring, active state updates (component)
      --> every screen that uses those components updates (page)
```

This is why specifying tokens correctly at the primitive and semantic level matters more than specifying individual component colors. Get the palette right, and components follow.

---

## 5. Dark Mode Design Process

The technical implementation of dark mode is covered in [05-token-pipeline, section 4](./05-token-pipeline.md#4-dark-mode). This section focuses on the design decisions you need to make.

### The current state

The prototype's dark palette was invented by the developer. It works, but it was not designed. For production, a designer must specify the dark mode values. This is explicitly called out as a gap in the existing docs.

### What you need to deliver

**A complete `colorScheme.dark` specification**, covering:

| Token group | What to specify | Light mode reference | Design consideration |
|-------------|----------------|---------------------|---------------------|
| **Surface scale** | 11 shades (0 through 950) | Stone palette from #FAFAF9 to #0C0A09 | In dark mode, the scale direction stays the same: 0 is lightest, 900 is darkest. PrimeNG expects this. |
| **Primary color** | 4 values: color, contrast, hover, active | Indigo 500/White/400/600 | In dark mode, primary typically shifts lighter (e.g., from 500 to 400) for sufficient contrast against dark backgrounds |
| **Text colors** | 4 values: color, hover, muted, hoverMuted | Stone 900/950/500/600 | Dark mode text should be light (e.g., Stone 50 for primary, Stone 300 for muted) |
| **Highlight colors** | 4 values: background, focusBg, color, focusColor | Indigo 100/200/600/700 | Reduce background opacity or use darker tints to avoid glare |

### Design principles for dark mode

**Preserve visual hierarchy, not exact colors.** The goal is not to invert the palette. It is to maintain the same relative contrast relationships. A heading that stands out in light mode should stand out equally in dark mode.

**Reduce overall contrast slightly.** Pure white (#FFFFFF) text on pure black (#000000) backgrounds causes eye strain. Use off-whites (Stone 50, #FAFAF9) on near-blacks (Stone 900, #1C1917).

**Use fewer shades.** Dark backgrounds compress the usable luminance range. Where light mode might use five surface shades to distinguish nested containers, dark mode may need only three or four.

**Status colors need adjustment.** Success green, warning amber, and danger red look different against dark backgrounds. The tag backgrounds (e.g., #DCFCE7 for success) are too light for dark mode. You may need to specify separate tag background/foreground pairs for each mode.

**Test with real content.** Dark mode issues are most visible with real data -- long text, mixed-status tables, nested cards. Do not sign off on dark mode based on a single static mockup.

### How to deliver the dark palette

Use the same format as the light mode spec in [design-spec](./design-spec.md), but add a "Dark Mode" column or a separate table. The developer will map your values into the `colorScheme.dark` block of the preset file. If you are using Tokens Studio or the PrimeOne UI Kit, both light and dark values can be exported together -- see [05-token-pipeline](./05-token-pipeline.md#4-dark-mode) for details.

---

## 6. Requesting Component Features

When you need something the design system does not currently support -- a new variant, an icon-only button, a custom organism layout -- here is how to communicate it effectively.

### Step 1: Check what exists

Before requesting a new feature, verify it is not already available:

- Browse the [component catalogue](./component-catalogue.md) for built components
- Check the [design-spec](./design-spec.md) for already-specified components
- Open Storybook and use the Controls panel to explore existing variants

### Step 2: Classify the request

| Type | Example | Typical effort |
|------|---------|----------------|
| **Token change** | "Make buttons more rounded" | Minutes. Change a value in the preset. |
| **New variant** | "Add a compact stat card" | Hours. New input on existing component, conditional styling. |
| **New atom** | "Add a progress bar atom" | Half day. New wrapper around a PrimeNG primitive. |
| **New molecule** | "Add a user info block (avatar + name + role)" | Half day to a day. Compose existing atoms. |
| **New organism** | "Add a notification feed" | 1-2 days. New data-aware component with all four states. |
| **PrimeNG workaround** | "Custom date picker layout" | Days. May require deep CSS overrides or custom components. |

### Step 3: Provide what the developer needs

A request that includes the following will get built faster:

- **Visual spec** -- a Figma frame showing the desired result in all states (default, hover, focus, disabled, and for organisms: loading, error, empty)
- **Token values** -- colors, spacing, radii, typography (reuse existing tokens where possible)
- **Responsive behavior** -- how it should adapt at each breakpoint
- **Where it sits in the hierarchy** -- is this an atom, molecule, or organism?
- **Priority context** -- is this blocking a screen, or a nice-to-have?

### Step 4: Discuss, do not ticket

On a 2-4 person team, the fastest path is a conversation. Walk through the design together. The developer may suggest an approach that is simpler to implement or point out that an existing component already covers the need with a small modification.

If the request is large (new organism, PrimeNG workaround), it should become a PBI. See [08-pbi-and-ba-guide](./08-pbi-and-ba-guide.md) for how those are structured.

---

## 7. Storybook as a Design Tool

Storybook is a live gallery of every built component, isolated from the rest of the application. It is the primary surface where design and development converge.

### Accessing Storybook

- **Live deployment:** [https://roryford.github.io/atomic-prototype/](https://roryford.github.io/atomic-prototype/)
- **Locally:** Run `npm run storybook` in the project root. It opens in your browser at `localhost:6006`.
- **PR previews:** If CI is configured, each pull request deploys a Storybook preview. The PR will contain the link.

### What to look for

When reviewing a component in Storybook, compare it against your Figma design and check:

| Check | What to look at | How to spot issues |
|-------|----------------|-------------------|
| **Color accuracy** | Backgrounds, text, borders, status indicators | Use a color picker tool to sample values from both Figma and Storybook |
| **Spacing** | Padding, margins, gaps between elements | Browser dev tools (right-click, Inspect) show computed values |
| **Typography** | Font size, weight, line height, letter spacing | Inspect panel or visual comparison |
| **States** | Default, hover, focus, active, disabled | Use the Controls panel to toggle states; hover and tab through the component |
| **Responsive behavior** | Layout changes at breakpoints | Resize the Storybook canvas or use the viewport addon |
| **All organism states** | Loading, error, empty, data | Switch between stories in the sidebar -- each state has its own story |
| **Dark mode** | Color switching, contrast, readability | If a dark mode toggle is available, test every state in both modes |

### Using the Controls panel

At the bottom of each story, the Controls panel exposes the component's inputs. You can:

- Toggle boolean properties (disabled, loading)
- Change text content to test with long strings, empty strings, or special characters
- Switch severity values (success, warning, danger, info)
- Resize the viewport to test responsive behavior

This is faster than asking a developer to create test cases. Explore freely.

### Flagging issues

Keep feedback specific and actionable:

| Less helpful | More helpful |
|-------------|-------------|
| "This looks off" | "The card border radius is 6px but should be 12px per the spec" |
| "Colors are wrong" | "The tag success background is #E0E7FF (info) instead of #DCFCE7 (success)" |
| "Spacing feels tight" | "The gap between stat cards is 8px but the spec says 16px (md spacing)" |

On a small team, say it in conversation or post it as a PR comment. For the full review workflow, see the "Designer's Storybook Review" section in [04-parallel-development](./04-parallel-development.md#designers-storybook-review).

---

## Cross-References

- For the full atomic hierarchy definitions: [01-atomic-hierarchy](./01-atomic-hierarchy.md)
- For the token pipeline (technical details): [05-token-pipeline](./05-token-pipeline.md)
- For parallel design-dev workflow: [04-parallel-development](./04-parallel-development.md)
- For the simulated Figma handoff format: [design-spec](./design-spec.md)
- For visual component reference: [component-catalogue](./component-catalogue.md)
- For PBI writing and BA workflow: [08-pbi-and-ba-guide](./08-pbi-and-ba-guide.md)
- For risk awareness: [10-derisking](./10-derisking.md)
