# Prototype Simulation: Lessons Learned

Key findings from simulating the POC → Prototype transition. These lessons apply to any team following this atomic design process.

---

## Technical Lessons

### Lazy Loading Is the Single Biggest Win
Initial bundle dropped from 1.06MB → 540KB (49% reduction) by switching to `loadComponent()` in routes. One-line-per-route change. Do this on day 1 of prototype, not later.

### httpResource() Works but Is Experimental
Import from `@angular/common/http`, marked `@experimental 19.2`. API is clean: `.value()`, `.isLoading()`, `.error()`, `.hasValue()`, `.reload()`. Transparent to MSW and Angular interceptors. Wrap behind services — the API could change.

**Fallback:** `toSignal(this.http.get<T>(url))` with manual state tracking (~10 extra lines per method).

### TableModule Is Still Heavy
List page lazy chunk is 466KB due to ~11 transitive PrimeNG dependencies. Even with standalone imports, Table pulls in dialog, datepicker, tree, treetable. Next optimization: `@defer (on viewport)` for the table.

### Stylelint Catches .scss but Not Inline TypeScript Styles
11 hardcoded hex values were found — all in TypeScript `styles:` arrays. Stylelint's `color-no-hex` gives false confidence unless the team also extracts inline styles to .scss files. Make "no hardcoded hex" a PR review checklist item.

### Storybook 10 + Angular 21 Works with Friction
- Must use `ng run project:storybook`, NOT direct `storybook dev`
- PrimeIcons CSS must load via CDN in `preview-head.html` — direct import fails with webpack
- PrimeNG theming works via `applicationConfig` decorator in `preview.ts`

### PrimeNG onClick Doesn't Fire in jsdom
Unit tests using `fixture.nativeElement.querySelector('button').click()` don't trigger PrimeNG's `(onClick)` output. Test output wiring directly in unit tests. Use Storybook play functions for real interaction testing.

### Test Runner Needs Manual Setup After --skip-tests
Angular 21 with `--skip-tests` scaffolding has no test target in `angular.json`. Adding Vitest requires: manual target, `vitest` + `jsdom` packages, `tsconfig.spec.json`. Better to scaffold without `--skip-tests`.

### Don't Change angular.json Prefix Globally
Changing `"prefix": "app"` to `"ds"` affects `ng generate` for ALL components including pages. Pages should keep `app-`. Rename design system selectors manually.

---

## Dark Mode Lessons

### What Works
- `colorScheme.dark` in `definePreset()` + `.dark-mode` class toggle = zero `!important` needed
- Nested components cascade correctly via CSS custom properties
- Toggle: `document.documentElement.classList.toggle('dark-mode')`

### The #1 Gotcha
Hardcoded hex values don't respond to dark mode. Any `background: #FAFAF9` stays light in dark mode. Must use `var(--p-surface-50)`. This is the dominant issue — found in 11 places across 4 files.

### What's Missing
- No automated dark mode visual verification (Chromatic Modes would help but is paid)
- Design spec has no dark mode palette — developer invented the `colorScheme.dark` values
- Path B (PrimeOne, paid) would auto-generate both light/dark from Figma Variable modes

---

## Process Lessons

### Acceptance Criteria Before Code (Shift-Left)
Writing Given/When/Then specs before building organisms forced completeness. Without criteria, developers implement 2 states (data + loading) and call it done. With criteria, all 5+ states are specified and tested.

### The Design Spec Needs Extension at Prototype
The POC design spec covers the "data" state only. Prototype needs: loading skeleton dimensions, empty state icons and copy, error message patterns, interaction states (hover/focus/disabled), and new component specs. Nobody in the process docs says who produces this. A real team needs the designer to extend the spec before organism PBIs are written.

### Organisms Are Where PBIs Fail
Atoms and molecules are simple — the component API IS the requirement. Organisms need data interfaces, all states, responsive behavior, keyboard nav, error recovery, and a reference to who designed the non-data states. This is where BA involvement matters most.

### Don't Defer Keyboard Nav and Responsive
Build them into organisms during creation, not in a "polish" phase. Retrofitting keyboard support into a card grid is harder than adding tabindex + keydown handlers during initial build.

### Three New States Were Discovered
- **Search-no-results:** distinct from empty (user took an action)
- **Partial failure:** one API succeeds while another fails
- **Detail skeleton:** form-shaped skeleton matching field layout

These wouldn't have surfaced without acceptance criteria forcing edge-case thinking.

---

## Tooling Lessons

| Tool | Verdict | Key Learning |
|------|---------|-------------|
| MSW v2 | Excellent | Transparent to httpResource, zero service changes needed |
| Storybook 10 | Works with friction | Use `ng run`, CDN for icons, `applicationConfig` for providers |
| Stylelint | Partial | Blind to inline TypeScript styles — supplement with PR review |
| httpResource() | Promising but experimental | Wrap behind services, have toSignal fallback ready |
| Vitest | Fast | 36 tests in 2 seconds, Angular 21 default runner |
| source-map-explorer | Essential | Revealed TableModule pulling 11 unused transitive deps |

---

## Things to Avoid

1. Don't hardcode hex in component styles — use `var(--p-*)` from day 1
2. Don't change angular.json prefix globally — rename selectors manually
3. Don't use `storybook dev` directly with Angular 21 — use `ng run`
4. Don't rely on jsdom click events for PrimeNG — use play functions
5. Don't write organism PBIs without listing ALL states
6. Don't skip the design spec extension — somebody must design loading/error/empty states
7. Don't put TableModule-heavy pages in the initial bundle — lazy-load them
8. Don't defer keyboard nav to a polish phase — build it in
9. Don't let Stylelint zero-violations create false confidence about hex values
10. Don't write acceptance criteria after code — the whole point is shift-left
