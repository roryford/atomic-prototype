# De-Risking: Questions to Answer as You Build

> **When to read:** Before each maturity transition (POC start, Prototype start). Use the summary table to track which risks you have addressed. Read time: ~8 minutes.

A small team de-risks by building. These are not scheduled spikes -- they are questions to answer as you go. You will surface most of these naturally as you build screens and flows. The structure below tells you when to expect each one so nothing is a surprise.

Each risk below describes how you will naturally discover it while building. The goal is not to spike every risk upfront -- it is to recognize each one when it appears and know the 30-minute response.

For Angular-specific concerns, see [09-angular-direction.md](./09-angular-direction.md). For the parallel development model, see [04-parallel-development.md](./04-parallel-development.md).

---

## During POC

Things you will discover while building the first 2-5 screens.

### PrimeNG / Design Language Fit

The design language in Figma assumes full control over component internals. PrimeNG's `definePreset()` API exposes some knobs but not all. The gap between "themed" and "custom" determines how much CSS surgery the team inherits.

**How you'll notice:** You try to replicate a Figma comp and hit a property that `definePreset()` doesn't expose. You reach for `::ng-deep` or a wrapper hack.

**What to do:** Take 2-3 representative components from Figma, replicate them using only `definePreset()`. Document every property that required a CSS escape hatch. Share the list with design so they can adjust or accept the cost.

### Responsive Approach

Some layouts reflow (same DOM, different CSS grid) and some restructure (different DOM, different components). The team needs a heuristic, not per-screen decisions.

**How you'll notice:** You build a screen at mobile width and realize the desktop layout cannot simply reflow -- the content order or component choice needs to change.

**What to do:** Build one representative screen at every breakpoint. Force the decision: reflow or restructure? Document the heuristic so other screens can be classified without another spike.

### CSS Specificity / Theming Conflicts

Component-level style overrides work in isolation but break when composed -- a themed button inside a themed card inside a themed dialog. Dark mode styles may leak across containers.

**How you'll notice:** Styles that worked in a single-component test page break when that component is nested inside others. You start adding `!important` to fix things.

**What to do:** Build one screen with nested overrides: a card containing a form containing themed inputs, rendered in both light and dark mode. If overrides compose cleanly, the strategy works. If not, change it before it propagates.

### Third-Party Integration Behavior

Analytics SDKs, feature flag libraries, or map widgets may conflict with PrimeNG's DOM management or Angular's change detection. They may inject global styles that break theming.

**How you'll notice:** After adding a third-party script, existing components behave differently -- change detection fires unexpectedly, styles shift, or routing breaks.

**What to do:** Integrate the actual SDK (not a mock) into a throwaway page with PrimeNG components. Verify that change detection, styling, and routing still behave. Document any workarounds.

### Bundle Size Baseline

PrimeNG tree-shaking may not work correctly, the icon library may pull in everything, or lazy-loaded routes may still produce a large initial bundle.

**How you'll notice:** Run a production build. Look at the output size. If the initial bundle is already large with only a few components, the trend will get worse.

**What to do:** Run `ng build --configuration production` and check bundle size. Use `source-map-explorer` if anything looks surprising. Set a rough budget. Fix import patterns before they spread.

**Prototype follow-up:** If the POC baseline exceeds 800KB, apply route-level lazy loading (`loadComponent()`) and template-level `@defer` for heavy organisms (especially `p-table`). Use `source-map-explorer` (not `webpack-bundle-analyzer`) for accurate attribution. See [11-implementation-tips](./11-implementation-tips.md) for budget recommendations.

---

## During Prototype

Things you will discover while building real flows with mocked data.

### Token Coverage Gaps

Figma contains values that do not map to any design token -- 13px font sizes, arbitrary hex colors, one-off spacing values. These sneak into production as magic numbers.

**How you'll notice:** A developer implementing a Figma comp finds a value that is not in the token set and hardcodes it.

**What to do:** Diff every unique value from Figma against the token set. Every unmatched value gets one of three dispositions: add to tokens, snap to nearest token, or flag as intentional exception.

### State Management Complexity

Multiple organisms share state -- filters affect a table which affects a summary panel which affects a toolbar. Naive implementations create race conditions or circular update loops.

**How you'll notice:** You wire two organisms together and updates feel laggy, out of order, or trigger infinite loops.

**What to do:** Pick the most interconnected set of organisms and wire them together with the intended state approach (signals, NgRx, service + BehaviorSubject). Stress test with rapid input and simulated latency.

### API Contract Alignment

Frontend assumes field names, pagination shapes, error formats, and enum values that may not match what the backend actually returns.

**How you'll notice:** You start integrating real (or realistic) API responses and fields are missing, names differ, or error shapes do not match your interfaces.

**What to do:** Agree on TypeScript interfaces with backend before building organism-level mock services. Generate from OpenAPI specs if available. Use those interfaces in mocks so the shape is locked.

### Performance at Realistic Data Volumes

Components work with 10 mock items. Production may have 50,000. Virtual scrolling, pagination strategy, and render performance are not validated until you test at scale.

**How you'll notice:** You load a table or list with 1,000+ items and it stutters, freezes, or crashes the tab.

**What to do:** Test every data-heavy organism with realistic volumes. Measure initial render, scroll performance, and memory. Establish a performance budget.

### Auth Flow Complexity

Mock auth (hardcoded tokens, no role checks) hides the real complexity of login redirects, token refresh, role-based visibility, and session expiration.

**How you'll notice:** You try to implement a role-based guard or token refresh and realize it touches every route and every API call.

**What to do:** Implement the real auth flow early -- OAuth redirect, token storage, refresh logic, and at least one role-based guard. Do this before building many screens so every subsequent component inherits the pattern.

### Accessibility Beyond Automated Checks

Color contrast passes automated checks. But complex interactions -- modal focus traps, table keyboard navigation, drag-and-drop -- may be inaccessible.

**How you'll notice:** You run a screen reader (VoiceOver or NVDA) on a flow with modals or data tables and the experience is unusable.

**What to do:** Screen reader test 2-3 representative flows that include modals, data tables, and any custom interactions. Document failures and decide whether to fix the pattern or change the interaction.

### Stylelint Coverage Gap

The `color-no-hex` rule catches hex values in `.scss` and `.css` files but cannot inspect inline styles in Angular component TypeScript `styles:` arrays. This creates false confidence -- the prototype simulation found 11 hardcoded hex values, all in inline TypeScript styles that Stylelint missed.

**How you'll notice:** Stylelint reports zero violations but a manual audit of `.ts` component files reveals hardcoded hex colors in inline `styles:` arrays.

**What to do:** Mitigate by: extracting inline styles to `.scss` files for molecules and above (per [03-project-structure](./03-project-structure.md)), adding hex checks to the PR review checklist, or writing a custom ESLint rule.

### `httpResource()` Experimental API

Angular 21's `httpResource()` (from `@angular/common/http`) is marked `@experimental 19.2`. It works well for prototype-stage data fetching with built-in loading/error/data signals.

**How you'll notice:** The API signature changes between Angular minor versions, or the `@experimental` decorator emits build warnings.

**What to do:** Mitigate by wrapping all `httpResource()` calls behind service methods. If the API changes, only the service internals need updating. Fallback: `toSignal(this.http.get<T>(url))` from `@angular/core/rxjs-interop` with manual state tracking (~10 extra lines per method).

### Error Recovery Patterns

Network failures, slow responses, and server errors create blank screens, lost form data, and infinite spinners.

**How you'll notice:** You simulate a failed or slow API call (using MSW or throttling in dev tools) and the UI shows nothing useful or loses user input.

**What to do:** Build the error recovery pattern once -- retry, fallback UI, notification -- and apply it everywhere. Test what happens when every API call in a flow fails or takes 10 seconds.

---

## Ongoing

Things to watch for throughout the project.

### Design Churn Exceeding Dev Capacity

Design iterates faster than dev can absorb. Components get rebuilt before they are finished. The backlog fills with "update to match new design" tickets.

**How you'll notice:** Dev is reworking components that were recently completed. Sprint velocity drops despite people being busy. Frustration rises on both sides.

**What to do:** Establish a cadence: design finalizes components at least one sprint ahead of dev. If churn is constant, the design is not ready for dev to consume -- pause dev on those components and redirect effort elsewhere.

### Scope Creep in the Design System

The team starts building more process than product -- elaborate token pipelines, multi-environment Storybook deploys, governance docs that nobody reads.

**How you'll notice:** Time spent on "the system" exceeds time spent on "the product." The team debates tooling configurations instead of shipping screens.

**What to do:** Apply a simple test: does this tooling or process help us ship the next screen faster? If not, defer it. A 2-4 person team needs less infrastructure than it thinks.

### Backend Availability and Alignment

Backend APIs are not ready when frontend needs them, or they change without notice. Integration becomes a bottleneck.

**How you'll notice:** Frontend work stalls waiting for endpoints. Completed integrations break after backend deploys. The two teams are not in sync.

**What to do:** Agree on interface contracts early (see API Contract Alignment above). Use mock services so frontend is never blocked. Establish a lightweight notification process for backend API changes -- even a shared channel message is enough.

---

## Summary

| Risk | When You'll Notice | What To Do | Effort |
|------|-------------------|------------|--------|
| PrimeNG / design fit | POC: first Figma replication | Spike 2-3 components with `definePreset()` only | Half day |
| Responsive approach | POC: first mobile-width build | Build one screen at all breakpoints, document heuristic | Half day |
| CSS specificity conflicts | POC: first nested composition | Test nested themed components in both modes | Half day |
| Third-party integration | POC: first SDK integration | Integrate real SDK in throwaway page | 2-4 hrs each |
| Bundle size baseline | POC: first prod build | Run prod build, check size, set budget | 30 min |
| Token coverage gaps | Prototype: first token audit | Diff Figma values against token set | 2-4 hrs |
| State management | Prototype: first shared-state wiring | Build one shared-state proof with stress test | 1 day |
| API contract alignment | Prototype: first mock service | Agree on TypeScript interfaces with backend | 2-4 hrs/domain |
| Performance at volume | Prototype: first large dataset | Test data-heavy organisms with 1,000+ items | Half day |
| Auth flow complexity | Prototype: first real auth attempt | Implement real auth flow early | 1-2 days |
| A11y beyond automated | Prototype: first screen reader test | Screen reader test 2-3 representative flows | Half day |
| Stylelint coverage gap | Prototype: first lint audit | Extract inline styles or add ESLint rule | 2-4 hrs |
| `httpResource()` experimental | Prototype: first data-fetching organism | Wrap behind service methods | 1 hr/service |
| Error recovery | Prototype: first simulated failure | Build error pattern once, apply everywhere | Half day |
| Design churn | Ongoing: rework frequency | Establish design-ahead cadence | Process change |
| Scope creep (system) | Ongoing: tooling vs product ratio | Apply "does this ship screens faster?" test | Awareness |
| Backend availability | Ongoing: integration friction | Contract-first, mock services, change notifications | Process change |

Total technical effort across the 14 build-time risks: roughly 7-9 days (effort varies with team size and scope). That investment prevents weeks of rework during production.

---

## Cross-References

- For Angular-specific concerns, see [09-angular-direction.md](./09-angular-direction.md).
- For the parallel development model, see [04-parallel-development.md](./04-parallel-development.md).
- For implementation tips and patterns, see [11-implementation-tips.md](./11-implementation-tips.md).
- For tool options and procurement guidance: [06-tooling-landscape](./06-tooling-landscape.md)
