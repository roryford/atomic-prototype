# QA Per Atomic Level

> **When to read:** When writing tests or reviewing PRs. Use as a checklist, not a narrative. Read time: ~12 minutes (or skim the Quick Reference tables).

Answers: **What does QA look like at each atomic level for a small team?**

This document defines QA checklists, certification criteria, and feedback loops for every level of the atomic hierarchy. It assumes a small team (2-4 devs) where developers write tests, the designer reviews in Storybook, and PR review is the certification gate. No separate QA role required.

Companion to the hierarchy defined in [01-atomic-hierarchy.md](./01-atomic-hierarchy.md).

---

## Triage Priority

Not all checks are equally important. When time is limited -- and on a small team it always is -- you need to know which checks to run first and which can wait. The triage tiers below map directly to the maturity stages defined in [02-maturity-stages.md](./02-maturity-stages.md).

### Tier Definitions

**Tier 1 -- Must-have for merge.** These checks prevent bugs in production. If any Tier 1 check fails, the PR does not merge. Examples: input/output contract correctness, four-state coverage for organisms (loading, empty, populated, error), zero critical accessibility violations.

**Tier 2 -- Should-have for certification.** These checks ensure quality beyond basic correctness. Required at Prototype stage and above. Examples: all visual states covered in Storybook, interaction tests for molecules, responsive verification for templates.

**Tier 3 -- Nice-to-have for polish.** These checks ensure excellence. Required at Production stage. Examples: performance budgets, cross-browser testing, visual regression, animation smoothness.

### Maturity Stage Mapping

| Maturity Stage | Required Tiers |
|---|---|
| POC | Tier 1 only |
| Prototype | Tier 1 + Tier 2 |
| Production | Tier 1 + Tier 2 + Tier 3 |

A component at POC stage passes review with only Tier 1 checks complete. A component claiming Prototype maturity must pass Tier 1 and Tier 2. Production maturity requires all three tiers.

### When You're Short on Time

At minimum, complete all Tier 1 checks. These are the correctness and safety checks that prevent cascading defects. If a Tier 2 check is skipped, note it in the PR description as a follow-up item so it is tracked and not forgotten. Never skip Tier 1.

---

## Core Principle: Self-Certifying Levels

Each atomic level is **independently certifiable**. A component at level N can only be certified if every component it consumes at level N-1 is already certified. QA never "reaches down" -- it trusts the level below.

- A molecule's QA does **not** re-test its child atoms. It trusts their certification.
- An organism's QA does **not** re-test molecule internals. It tests how molecules integrate.
- A page's QA does **not** re-test organism state logic. It tests the full user journey.

If a defect is found at level N that originates at level N-1, the fix happens at N-1. The component is re-certified there before level N retests.

**The Cascade Rule:** QA intensity shifts as you move up the hierarchy. Lower levels demand exhaustive unit-level correctness; higher levels demand integration correctness and real-world fidelity. No level is "more important" -- they are differently important.

---

## Level 1 -- Atoms

Atoms are the foundation — defects here cascade to every molecule, organism, and page that uses them. Token compliance, accessibility, and input/output correctness must be solid at this level.

> **Examples:** Button, Input, Label, Icon, Badge, Avatar, Checkbox, Tag

Atoms are thin wrappers around a single PrimeNG primitive or native HTML element. Purely presentational, stateless, styled through design tokens. Defects here have the widest blast radius.

### What to Check

- [ ] [T1] Uses design tokens, not hardcoded values (`var(--p-primary-color)`, not `#3B82F6`)
- [ ] [T1] Every `input()` has a sensible default; every `output()` emits correctly
- [ ] [T2] Storybook stories cover all visual states (default, hover, focus, active, disabled, loading)
- [ ] [T1] ARIA roles present, keyboard focus visible, contrast ratio passes
- [ ] [T1] Zero service injections; zero imports from higher levels
- [ ] [T3] Wrapper adds negligible size over raw PrimeNG primitive

### Manual Approach vs Tooling-Accelerated

| Check | Manual | Tooling accelerates with... |
|---|---|---|
| Token fidelity | Inspect computed styles in browser DevTools | Stylelint custom token-audit rule |
| Input/Output contract | Write unit tests by hand | Test generation from component metadata |
| Visual regression | Compare Storybook to Figma side-by-side | Chromatic / Percy snapshot diff |
| Accessibility | Tab through component, run axe in browser | axe-core in CI, Storybook a11y addon |
| Isolation | Review imports manually | ESLint boundary rule |

### QA Criteria

| Criterion | Threshold |
|---|---|
| Unit test coverage | All `input()` / `output()` combinations exercised |
| Visual states | Story exists for every state (default, hover, focus, disabled, error, loading) |
| Accessibility | Zero axe-core violations (critical + serious) |
| Token compliance | No hardcoded color, spacing, or typography values |
| Isolation | No service injections; no imports from molecules or above |

### What's Unique at This Level

- **Token drift is the primary risk.** A hardcoded hex value instead of a token reference breaks theming silently.
- **Every state must have a story.** Atoms have few states -- test all of them. This is cheap now, expensive later.
- **Accessibility is cheapest to fix here.** An inaccessible atom poisons every molecule, organism, and page above it.
- **No mocking required.** Atoms have no dependencies beyond PrimeNG primitives, so tests are fast and deterministic.

### Certification: Ready When

The atom is certified when: stories exist for all states, unit tests pass, axe-core reports zero critical/serious violations, and the PR is approved by a reviewer who checked the list above.

---

## Level 2 -- Molecules

> **Examples:** Search Bar, Form Field, Nav Item, Card Header, Stat Card

Molecules compose 2-4 atoms into a single reusable unit with local interaction logic (focus, validation, toggle) but no data fetching or global state.

### What to Check

- [ ] [T1] All consumed atoms are certified
- [ ] [T1] Cross-atom wiring is correct (label `for` matches input `id`, error displays on validation failure)
- [ ] [T1] Interaction logic works (focus chain, validation trigger, toggle states)
- [ ] [T2] Works with different input combinations without modification (proven in Storybook args)
- [ ] [T1] Zero service injections; no store reads or writes
- [ ] [T2] Interaction tests cover user flows (click, type, tab sequences)

### Manual Approach vs Tooling-Accelerated

| Check | Manual | Tooling accelerates with... |
|---|---|---|
| Atom certification | Check that child atoms have approved PRs | Dependency graph validation in CI |
| Composition correctness | Inspect DOM, verify `for`/`id` pairing | Integration tests + axe-core |
| Interaction logic | Click through states in Storybook | Storybook play functions (interaction tests) |
| Reusability | Render with different args in Storybook | Storybook args matrix |
| Visual consistency | Compare Storybook to Figma | Chromatic snapshot diff |

### QA Criteria

| Criterion | Threshold |
|---|---|
| Atom dependencies | All child atoms certified |
| Integration tests | Cross-atom wiring verified (focus chains, label-input binding) |
| Interaction tests | Storybook play functions cover primary user interactions |
| Accessibility | Zero axe-core violations; keyboard navigation correct |
| Reusability | Renders correctly with at least 3 different input combinations |
| No global state | Zero service injections confirmed |

### What's Unique at This Level

- **Cross-atom wiring is the primary risk.** A `for`/`id` mismatch between Label and Input breaks accessibility silently.
- **Validation logic lives here.** Form Field molecules own inline error display -- test every validation path.
- **Interaction testing starts here.** Use Storybook play functions to automate click-type-tab sequences. These catch wiring bugs that unit tests miss.
- **Tests require shallow rendering.** Mount the molecule with real child atoms but no parent context.

### Certification: Ready When

The molecule is certified when: all child atoms are certified, integration tests pass, interaction tests (play functions) pass, axe-core is clean, and the PR is approved.

---

## Level 3 -- Organisms

Organisms are where real data enters your system and where most production issues originate. State management, error handling, and data-driven rendering are the primary risks.

> **Examples:** Header/Navbar, Data Table, Sidebar Nav, Card Grid, Form Section

Organisms are complex, self-contained UI sections. This is where **real data enters** the component tree and state management (signals, stores, services) begins. The jump in QA complexity from molecules to organisms is the largest in the hierarchy.

### What to Check

- [ ] [T1] All consumed molecules are certified
- [ ] [T1] All four states render correctly: loading, empty, populated, error
- [ ] [T1] State transitions work: loading to populated, error to retry, empty to populated
- [ ] [T1] Services are injected only for this organism's concerns; no cross-organism coupling
- [ ] [T1] Graceful degradation on API failure, timeout, malformed data
- [ ] [T2] Signals / observables propagate correctly to child molecules
- [ ] [T3] OnPush change detection strategy; no unnecessary re-renders
- [ ] [T2] Interaction tests cover state-dependent user flows

### Manual Approach vs Tooling-Accelerated

| Check | Manual | Tooling accelerates with... |
|---|---|---|
| Molecule certification | Check that child molecules have approved PRs | Dependency graph validation in CI |
| State coverage | Toggle states in Storybook with args/controls | Integration tests with mock services |
| State transitions | Manually trigger loading-to-populated, error-to-retry | Storybook play functions that simulate transition sequences |
| Error resilience | Disconnect network in DevTools, observe behavior | Fault-injection tests (mock service returns 500, timeout) |
| Performance | Profile with Angular DevTools | Automated re-render count assertions |

### QA Criteria

| Criterion | Threshold |
|---|---|
| Molecule dependencies | All child molecules certified |
| State coverage | All four states (loading, empty, populated, error) have stories and tests |
| State transitions | Transitions tested: loading-to-populated, error-to-retry, empty-to-populated |
| Error resilience | API failure, timeout, and malformed data all handled gracefully |
| Service isolation | No cross-organism service coupling |
| Performance | OnPush change detection; no unnecessary re-renders with 100+ items |

### Additional State Distinctions

- **Distinguish between 'empty' and 'search-no-results.'** These are different states with different messages and recovery actions: empty (no data exists) shows "No [items] found" with an optional create action, while search-no-results (data exists but the current filter excludes everything) shows "No results for [query]" with a "Clear search" action.
- **Test partial failure scenarios** where one API succeeds and another fails within the same page. For example, a dashboard where stats load successfully but the project list fails should show stats normally alongside an error state for projects -- not a full-page error.

### What's Unique at This Level

- **State management is the primary risk.** Every state branch (loading, empty, error, populated) must be tested.
- **State transition testing matters here.** It is not enough that each state renders -- verify the transitions between them (loading to populated, error to retry with new data, empty to populated after filter change).
- **Mocking becomes essential.** Services must be stubbed to keep tests deterministic.
- **Error boundaries matter.** A failed API call in one organism must not crash the page.

### Certification: Ready When

The organism is certified when: all child molecules are certified, all four states are tested (including transitions), error handling is verified, performance is acceptable, and the PR is approved.

---

## Level 4 -- Templates

> **Examples:** Dashboard Layout, Settings Layout, Two-Column, Full-Width

Templates are page-level layout shells that define spatial structure through `ng-content` projection. They render **zero real data** and contain **zero business logic**. A broken layout breaks every page that uses it.

### What to Check

- [ ] [T1] All named `ng-content` slots render projected content correctly
- [ ] [T2] Layout reflows correctly at all defined breakpoints (see [04-parallel-development](./04-parallel-development.md) for canonical values)
- [ ] [T1] Empty slots collapse gracefully; multi-child slots render correctly
- [ ] [T1] Zero `input()` properties bound to entity data (layout-config inputs are acceptable)
- [ ] [T1] No `ngIf`, `ngFor`, service injections, or subscriptions
- [ ] [T1] Landmark roles (`main`, `nav`, `aside`) are correct; skip-nav works
- [ ] [T2] Content overflow scrolls or truncates gracefully, never breaks layout

### Manual Approach vs Tooling-Accelerated

| Check | Manual | Tooling accelerates with... |
|---|---|---|
| Slot projection | Render with mock content in Storybook | TestBed with mock projected content |
| Responsive layout | Resize browser, check each breakpoint | Playwright viewport tests at defined breakpoints |
| No data binding | Read the template source | ESLint rule prohibiting data-bound inputs |
| Landmark roles | Inspect DOM, verify landmarks | axe-core landmark validation |
| Overflow | Inject extremely long content, observe | Visual regression with extreme-content stories |

### QA Criteria

| Criterion | Threshold |
|---|---|
| Responsive correctness | Layout correct at all defined breakpoints (see [design-spec](./design-spec.md)) |
| Slot projection | Empty, single-child, and multi-child slots all render |
| Data independence | Zero entity-data bindings; zero service injections |
| Accessibility (layout) | Landmark roles correct; skip-nav functional |
| Overflow handling | No layout breakage with extreme content |

### What's Unique at This Level

- **Responsive correctness is the primary risk.** A template that breaks at 768px poisons every page using it.
- **There is nothing to unit test.** QA is entirely visual, structural, and responsive.
- **Slot projection must be bulletproof.** Test empty slots, single-child slots, and multi-child slots.
- **Landmark roles are set here.** Templates define the page's accessibility skeleton -- verify them once, trust them everywhere.

### Certification: Ready When

The template is certified when: all breakpoints are verified, slot projection works for all cases, zero data dependencies confirmed, landmarks are correct, and the PR is approved.

---

## Level 5 -- Pages

> **Examples:** Dashboard, User Settings, Search Results, Detail View

Pages are routed components that wire real data to templates and organisms. They are the **only** level that touches Angular routing, guards, resolvers, and live API calls. This is where all lower-level QA investments pay off or fail.

### What to Check

- [ ] [T1] All consumed templates and organisms are certified
- [ ] [T1] Route resolves correctly; guards redirect as expected
- [ ] [T1] Resolver loads data before render; loading state shows during resolution
- [ ] [T1] Full user journey works (land, interact, submit, confirm)
- [ ] [T2] Error paths handled: 401, 403, 404, 500, network timeout
- [ ] [T3] Performance budget met: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] [T3] Cross-browser: Chrome, Firefox, Safari verified (Edge in CI if available)

### Manual Approach vs Tooling-Accelerated

| Check | Manual | Tooling accelerates with... |
|---|---|---|
| Route/guard behavior | Navigate manually, test with/without auth | Playwright navigation tests |
| Full user journey | Walk through the flow by hand | Playwright E2E suite |
| Error paths | Throttle/block network in DevTools | Playwright network interception |
| Performance | Run Lighthouse manually (3 runs, take median) | Lighthouse CI in pipeline |
| Cross-browser | Open in each browser | Playwright multi-browser matrix |

### QA Criteria

| Criterion | Threshold |
|---|---|
| Template + Organism dependencies | All certified |
| Route configuration | Guards, resolvers, lazy loading, redirects all work |
| E2E coverage | Primary user journey covered end-to-end |
| Performance | LCP < 2.5s, INP < 200ms, CLS < 0.1 (run 3x, median score) |
| Error recovery | 401, 403, 404, 500, and timeout all handled gracefully |
| Cross-browser | Chrome + Firefox + Safari pass |

### What's Unique at This Level

- **End-to-end correctness is the primary risk.** If the page fails, nothing below matters to the user.
- **Real data and real APIs are in play.** Tests run against staging, not mocks. Manage API instability with retries.
- **Performance budgets are enforced here.** Measure Core Web Vitals at this level (INP replaces the old FID metric).
- **This is where the team reviews against acceptance criteria.** The PR description should link to the user story and confirm which criteria are met.

### Certification: Ready When

The page is certified when: all dependencies are certified, E2E tests pass, performance budget is met, error paths are handled, cross-browser is verified, and the PR is approved.

---

## Quick Reference: Test Type by Level

Which test types are **required** (R), **recommended** (r), or **not applicable** (--) at each level.

| Test Type | Atoms | Molecules | Organisms | Templates | Pages |
|---|---|---|---|---|---|
| Unit | R | R | R | -- | -- |
| Integration | -- | R | R | r | r |
| Interaction (play functions) | -- | R | R | -- | -- |
| State transition | -- | -- | R | -- | -- |
| Visual / Snapshot | R | R | r | R | r |
| Accessibility | R | R | R | R | R |
| E2E | -- | -- | -- | -- | R |
| Performance | -- | -- | r | r | R |
| Cross-browser | -- | -- | -- | r | R |

**R** = Required for certification. **r** = Recommended, not blocking. **--** = Not applicable at this level.

---

## Quick Reference: Primary Risk by Level

| Level | Primary Risk | If Missed |
|---|---|---|
| Atoms | Token drift | Theming breaks across entire app |
| Molecules | Cross-atom wiring | Accessibility failures propagate to all forms |
| Organisms | Untested state branches | Users see blank screens or unhandled errors |
| Templates | Responsive breakpoint failures | Pages break on mobile or tablet |
| Pages | Uncovered user journeys | Production users hit broken flows |

---

## Certification Gates

> Merged from the original certification gates document. For a small team, this is simpler than it sounds.

### PR Review Is the Gate

On a 2-4 person team, there is no formal certification registry. The gate is the PR review process:

1. **Developer** writes the component, adds stories, writes tests.
2. **Reviewer** (another dev) checks the component against the level's checklist above.
3. **Designer** reviews the Storybook deployment (Chromatic, Storybook preview URL, or local) for visual correctness.
4. If all three are satisfied, the PR is approved. The component is certified.

The checklists in each level section above are what the reviewer checks. No separate sign-off document, no approval matrix.

### CI Pipeline: One Pipeline, Not Three

Keep it simple. One pipeline runs on every PR:

```
PR opened / updated
    |
    v
Lint (Prettier + Stylelint + ESLint) --> Unit Tests --> Build
    |
    v
PR mergeable (all green)
```

On merge to main:

```
Merge to main
    |
    v
Same checks + Storybook deploy (GitHub Pages)
```

E2E tests (Playwright) are available via `npm run e2e` and can be added to CI when the team decides on the trigger policy (every PR vs merge-only).

That is the whole pipeline for a small team. Add complexity only when you have evidence you need it. The enhanced prototype implements this pipeline in `.github/workflows/ci.yml`.

### When to Add More

| Signal | Add This |
|---|---|
| Visual regressions slip through PRs | Visual regression tooling (Chromatic, Percy) |
| Accessibility issues reach production | axe-core check in CI pipeline |
| Bundle size creeps up unnoticed | Bundle size check on PR |
| Performance degrades without anyone noticing | Lighthouse CI on merge to main |
| Security vulnerabilities ship | npm audit / Snyk in CI |

Each addition is a response to a real problem, not a preventive bureaucracy.

### Flaky E2E Tests

Flaky E2E tests erode trust in the pipeline. Two mitigations:

1. **Retries:** Set `retries: 2` in Playwright config. A test that passes on retry is still a warning sign, but it does not block the team.
2. **Quarantine:** If a test is flaky for more than a week, move it to a quarantine suite that runs but does not block merges. Fix the root cause, then move it back.

### Lighthouse Thresholds

For an Angular + PrimeNG SPA, a Lighthouse performance score of 90+ is often unrealistic without extensive optimization. Use realistic thresholds:

- **Warning at 80.** The PR comment notes the score but does not block.
- **Fail at 75.** The PR is blocked until performance is addressed.
- **Run 3 times, take the median.** Lighthouse scores vary between runs.
- Accessibility score: warn at 90, fail at 85.

---

## Feedback Loops

> Merged from the original feedback loops document. On a small team, most of this is conversation -- but knowing the patterns helps.

### Forward: Figma to Code

A design change in Figma needs to reach code. The path depends on your tooling maturity:

**Manual approach:** Designer updates Figma, tells the team ("I changed the primary button radius"). Developer finds the affected component, updates the token or style, opens a PR.

**Tooling-accelerated:** Figma token changes export through Tokens Studio / Style Dictionary. CI creates a PR with the updated token values. Developer (or designer in Storybook) reviews the visual diff.

Either way, the principle is the same: design is the source of truth for visual decisions. When Figma changes, code follows.

### Reverse: Code to Figma

A developer discovers something design has not accounted for -- a missing state, a browser constraint, an edge case with real data.

**Manual approach:** Developer tells the designer ("There is no empty state designed for this table when filters return zero results"). Designer updates Figma. Developer implements.

**Tooling-accelerated:** Developer flags the gap through a structured channel (Figma MCP bridge, a shared Notion board, a tagged comment). Designer creates the missing variant with proper tokens. Tokens export, developer implements.

The key: the developer should not invent the missing design. Flag it, let the designer fill the gap, then implement.

### Common Feedback Scenarios by Level

| Level | Common Finding | Direction |
|---|---|---|
| Atoms | Token value incorrect in code; missing state (e.g., no focus ring) | Figma to Code |
| Atoms | Browser-specific rendering constraint | Code to Figma |
| Molecules | Spacing inconsistency; missing interaction state (loading spinner not designed) | Both directions |
| Organisms | Data binding reveals missing empty state; error state UX unclear | Code to Figma |
| Pages | Real data overflows designed layout; performance budget exceeded | Both directions |

### Cross-Level Cascade

When a bug found at the Page level traces down to an Atom:

1. Fix at the Atom level.
2. Verify the fix does not break molecules and organisms that consume it.
3. If using visual regression tooling, review the cascade of visual diffs.
4. If not using visual regression tooling, manually check the affected components in Storybook.

This is why fixing bugs at the lowest responsible level matters. A fix at the Atom level is one change. The same fix attempted at the Page level is a workaround that does not propagate.

### Key Principle

Feedback loops are faster with tooling (MCP, Tokens Studio, Chromatic) but they work with just conversation. The tooling reduces the time from days to hours. The conversation reduces it from "never noticed" to "fixed this sprint." Start with conversation; add tooling when the conversation becomes a bottleneck.

---

## PrimeNG Testing Limitation

PrimeNG's `(onClick)` does not fire from DOM click events in jsdom. See [11-implementation-tips § PrimeNG Interaction Testing](./11-implementation-tips.md) for details and workarounds.

---

## Visual Regression Tooling: PrimeNG Mitigation

If using visual regression tooling (Chromatic, Percy, or similar) with PrimeNG components, two issues commonly cause false positives:

1. **PrimeNG animations.** Tooltip fade-ins, dropdown transitions, and ripple effects create snapshot instability. In your Storybook preview configuration, disable PrimeNG animations globally:
   - Set the PrimeNG animation config to disabled in the Storybook preview providers.
   - Disable CSS transitions/animations via a global Storybook stylesheet for the snapshot environment.

2. **Overlay viewport sizing.** PrimeNG overlays (dropdowns, dialogs, tooltips) position themselves relative to the viewport. If Chromatic's viewport size differs from your Storybook development viewport, overlays appear in different positions. Fix by setting explicit viewport sizes in your Storybook story parameters for any story that renders an overlay.

These are mitigation steps, not blockers. Visual regression tooling works well with PrimeNG once these two sources of noise are eliminated.

---

## Cross-References

- For the atomic hierarchy and component classification, see [01-atomic-hierarchy.md](./01-atomic-hierarchy.md).
- For tooling options, see [06-tooling-landscape.md](./06-tooling-landscape.md).
- For the design token pipeline, see [05-token-pipeline.md](./05-token-pipeline.md).
- For how QA evolves across maturity stages, see [02-maturity-stages.md](./02-maturity-stages.md).

## Related

- [manual-test-checklist](./manual-test-checklist.md) — browser verification checklist from the prototype simulation
