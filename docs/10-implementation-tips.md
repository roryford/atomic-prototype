# Implementation Tips

Practical guidance from running a simulated POC. These tips supplement the process docs — they capture what the docs don't say, and what a team learns in the first week.

---

## Before Writing Code

- **Settle file naming on day 1.** Angular 21 uses 2025 naming (`button.ts`, class `Button`) by default. The team must decide: adopt 2025 convention, or manually use legacy naming (`.component.ts`, `ButtonComponent`). Mixed naming in one project causes confusion. Pick one and stick with it.

- **Spike `definePreset()` in the first two days.** The token path discovery — figuring out that button colors live at `components.button.root.primary.background` — is the hardest part of theming. Don't save this for the end of the POC. Read `@primeuix/themes/types` to understand the nesting.

- **Agree on a single set of breakpoints.** The responsive approach (reflow vs restructure) should be decided in Week 1, with specific pixel values locked:
  | Name | Width | Columns |
  |------|-------|---------|
  | Mobile | < 640px | 1 |
  | Tablet | 640px – 1023px | 2 |
  | Desktop | 1024px – 1439px | 3 |
  | Wide | ≥ 1440px | 4 |

## Theming

- **Never hardcode hex values in component styles.** Use `var(--p-surface-50)`, `var(--p-text-color)`, `var(--p-primary-color)` etc. Hardcoded hex is the #1 reason dark mode breaks. Make this a PR review rule from day 1.

- **`definePreset()` covers ~80% of design needs.** For the remaining ~20%:
  1. Try the `pt` (passthrough) API first — it's type-safe and survives upgrades
  2. Use component-scoped CSS second
  3. `::ng-deep` or `ViewEncapsulation.None` only as a last resort
  No `!important` should be needed with PrimeNG 21.

- **`pt` API keys differ from `definePreset()` token names.** DataTable uses `headerCell` in definePreset but `thead` in the pt API. Always check PrimeNG's TypeScript types for correct pt keys — don't assume they match.

- **Font family has no token slot.** Set it via global CSS (`body { font-family: Inter, sans-serif; }`), not through `definePreset()`. Same for button default font-size — only `sm`/`lg` size variants have tokens.

## Atoms and Wrappers

- **Type your severity inputs.** PrimeNG uses union types for severity: `'success' | 'info' | 'warn' | 'danger' | ...`. If your atom wrapper uses `input<string>()`, it will fail type-checking when binding to the inner PrimeNG component. Declare the union locally or import it from PrimeNG.

- **Start with minimal inputs.** An atom wrapper should expose only the inputs the design system currently needs — not every input PrimeNG offers. Add more when a real use case demands it, not preemptively.

- **Use standalone imports for atoms.** `import { Button } from 'primeng/button'` is cleaner than module imports. Use `TableModule` only for organism primitives that need template directives (`pTemplate`, `pSortableColumn`).

## Bundle Size

- **`TableModule` is heavy.** It pulls ~11 transitive PrimeNG dependencies (dialog, datepicker, tree, treetable) even if you only use basic table features. A 3-page POC with 7 PrimeNG components produces a 1.06MB initial bundle (206KB gzipped).

- **Lazy-load routes from prototype stage onward.** Use `loadComponent()` in route definitions to keep the initial bundle manageable as the app grows.

- **Set realistic budgets.** Angular's default (500KB warning, 1MB error) is too tight for PrimeNG apps. Start with 1.2MB warning / 1.5MB error for POC. Track gzipped transfer size with a 250KB ceiling.

## Angular 21 Specifics

- **Zoneless is default.** Don't add `provideZonelessChangeDetection()` — it's unnecessary and may warn. Do add `provideBrowserGlobalErrorListeners()` (new in Angular 21).

- **Install `@angular/animations` separately.** PrimeNG needs `provideAnimationsAsync()`, which requires `@angular/animations`. It's not included in Angular 21's default scaffold: `npm install @angular/animations`.

- **Signals are first-class.** Use `input()`, `output()`, `model()` for atom APIs. Use `computed()` in molecules. Use `signal()` for hardcoded data in POC pages. Angular 21 generates component properties as signals by default.

## Process

- **Design and dev start together, not sequentially.** The designer shares token values (even rough ones) and the developer starts building the same week. Don't wait for a "final" design — iterate together.

- **Maturity is per-component, not per-project.** Your atoms can be at production quality while your pages are still at POC. Build from the bottom up: atoms → molecules → organisms → templates → pages.

- **The cascade rule works.** Each level imports only from the level below. This feels strict at first but prevents circular dependencies and makes components independently testable. Trust it.

- **Keep a "questions for design" list.** While building, the developer will discover missing states (empty table, error, loading). Don't block on these — build with placeholder states and flag them for the designer. Conversation, not tickets.

## Prototype Transition

- **Evaluate token pipeline tooling early in prototype.** Manual `definePreset()` works for 10-20 tokens but breaks at 50+. Choose between Tokens Studio + Style Dictionary (free, DIY) or PrimeOne Theme Designer (paid, turnkey). The paid path auto-generates dark mode tokens from Figma — the free path requires manual `colorScheme.dark` authoring.

- **Switch to `httpResource()` for data fetching.** It provides loading/error/data signals out of the box. Pair with PrimeNG `p-skeleton` for loading states and `p-message` for errors. Wrap behind service methods since the API is still experimental.

- **Add MSW for API mocking.** It intercepts at the network level — transparent to `httpResource()` and Angular interceptors. Zero changes to service code. Set up once in `main.ts` with `isDevMode()` guard.

- **Set up Stylelint to block hardcoded hex.** Add `color-no-hex` rule to catch violations before they reach PR review. This is the cheapest way to enforce the "always use `var(--p-*)` custom properties" rule.

- **Lazy-load routes from day 1 of prototype.** Use `loadComponent()` in route definitions. Use `@defer (on viewport)` for heavy below-fold organisms. The POC's 1.06MB initial bundle is too large for prototype.

- **Atoms and molecules are technical PBIs. Organisms and pages need BA involvement.** Below the organism boundary is 'dumb UI' where the component API is the requirement. Above it is 'smart features' where states, journeys, and error recovery matter. A BA (or someone in that role) should own acceptance criteria for organisms and pages.

- **Don't write 'handle loading and error' without specifying visuals.** An organism PBI must reference the design spec for what loading skeletons look like, what the error message says, and what the empty state shows. If the design spec doesn't cover these, flag it for the designer before starting development.

- **Distinguish search-no-results from empty.** Empty = no data exists ('No projects found' + optional create action). Search-no-results = data exists but filter excludes everything ('No results for [query]' + 'Clear search' action). These are different states with different UI.
