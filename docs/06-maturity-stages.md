# Maturity Stages: POC, Prototype, Production

POC, Prototype, and Production describe the **maturity of a component's output**, not sequential project phases. A team may have production-grade atoms, prototype-grade organisms, and POC-grade pages all at the same time.

These stages overlap. Design doesn't stop when dev starts prototyping. A prototype organism might depend on production-quality atoms. The stages describe where something is, not where the whole project is.

---

## Stage Definitions

### POC -- "Does this work?"

| Attribute | Value |
|-----------|-------|
| Duration | Days to 2 weeks |
| Fidelity | Low -- rough, exploratory |
| Data | Hardcoded, inline |
| Purpose | Prove feasibility, test assumptions, explore tooling |
| Throwaway | Mostly; expect to rewrite |

POC is where you spike PrimeNG fit, try Figma MCP, see if Storybook adds value. Tooling choices are part of exploration, not prerequisites.

### Prototype -- "Can users use this?"

| Attribute | Value |
|-----------|-------|
| Duration | 2 to 6 weeks |
| Fidelity | Mid-to-high -- recognizable as the real product |
| Data | Mocked APIs, realistic payloads |
| Purpose | Validate usability, discover missing states |
| Throwaway | Some; structure survives, details change |

Prototype is where you decide on token pipeline tooling, test framework, and API mocking approach. You know enough to make informed choices.

### Production -- "Can we ship?"

| Attribute | Value |
|-----------|-------|
| Duration | Ongoing |
| Fidelity | Pixel-perfect, fully specified |
| Data | Real APIs, real auth, real errors |
| Purpose | Deliver value, maintain reliability |
| Throwaway | Nothing; everything is maintained |

Production is where you add whatever automation the team needs -- CI checks, visual regression, performance monitoring. Add tooling when the pain justifies it, not before.

### How stages relate

Not everything starts at POC. Some components skip it entirely (a standard form field molecule where the pattern is well established). Some stay at Prototype indefinitely (an internal admin tool that never faces external users). The stage describes current quality, not position in a timeline.

---

## Atomic Levels Across Maturity Stages

### Atoms

| Aspect | POC | Prototype | Production |
|--------|-----|-----------|------------|
| **What you build** | Raw PrimeNG component with default theme; verify it renders and accepts tokens | Thin wrapper applying real design tokens; correct spacing, color, typography | Fully themed, all states (focus, disabled, error, loading), dark mode if needed |
| **QA approach** | Visual spot-check in browser | Story or test page with interactive controls; manual a11y check | Automated unit tests, axe-core, visual snapshot |
| **Tooling** | Browser dev tools | Storybook or a simple test harness -- whatever the team prefers | Automated checks in CI |

**Transition insight:** Atoms mature fastest because they are small and self-contained. Get them to production quality early -- everything above depends on them.

### Molecules

| Aspect | POC | Prototype | Production |
|--------|-----|-----------|------------|
| **What you build** | Two or three atoms composed inline; hardcoded props to test the combination | Proper `input()`/`output()` API; local interaction logic (focus, validation, toggle) | All edge cases handled; reusable across multiple organisms; documented API |
| **QA approach** | Do the atoms look right together? | Interactive testing; feedback on interaction patterns | Unit tests on interaction logic; integration snapshot; a11y pass on composition |
| **Tooling** | None beyond what atoms already use | Same test harness; validation helpers if needed | Same CI pipeline as atoms |

**Transition insight:** The molecule API is the contract organisms depend on. Lock `input()`/`output()` signatures at prototype stage to avoid cascading changes.

### Organisms

| Aspect | POC | Prototype | Production |
|--------|-----|-----------|------------|
| **What you build** | Hardcoded data rendering through molecules; prove the layout and data flow | Mocked API data via services; loading/empty/error states; responsive layout | Real API integration; full state machine; performance-optimized |
| **QA approach** | Does the layout work with realistic-shaped data? | Manual walkthrough of all states; test with realistic data volumes | E2E tests on critical paths; performance budget; API contract validation |
| **Tooling** | Mock data files | Mock service layer (MSW or simple interceptors) | Real API integration; monitoring if needed |

> **Angular 21 note:** `httpResource()` provides built-in loading/error/data state signals for organism-level data fetching, eliminating manual state management boilerplate. See [11-prototype-solutions § Loading States](./11-prototype-solutions.md).

**Transition insight:** Organisms are where most production risk lives. They sit at the boundary between UI and data. The prototype-to-production transition is the hardest and most valuable.

### Templates

| Aspect | POC | Prototype | Production |
|--------|-----|-----------|------------|
| **What you build** | Basic grid layout with placeholder slots; verify responsive breakpoints | Named `ng-content` projection slots; real breakpoint behavior; nested grid areas | All breakpoints tested; print styles if needed; container queries where appropriate |
| **QA approach** | Resize the browser; does it collapse correctly? | Test with realistic content projected into each slot | Responsive snapshots at all breakpoints; a11y landmark validation |
| **Tooling** | Browser responsive mode | Same as organisms | Same CI pipeline |

**Transition insight:** Templates are deceptively simple. Their production risk is low but their impact is high -- a broken template breaks every page that uses it. Test breakpoints thoroughly at prototype stage.

### Pages

| Aspect | POC | Prototype | Production |
|--------|-----|-----------|------------|
| **What you build** | Route wired to a template; organisms dropped in with hardcoded data | Real resolvers/guards; organisms consuming mocked services; full navigation flow | Real API calls; auth-gated; error boundaries; lazy-loaded |
| **QA approach** | Can you navigate to the page and see the layout? | Can a test user complete the primary task? | E2E smoke tests; performance audit; monitoring |
| **Tooling** | Angular router config | Route guards, resolver stubs | Full routing with lazy loading, analytics if needed |

**Transition insight:** Pages mature last because they depend on everything below them. Do not try to polish pages while organisms are still at prototype maturity.

### Maturity Order

Lower levels should reach production quality before higher levels attempt the same.

```
Atoms        ████████████████████  Production early
Molecules    ██████████████░░░░░░  Production shortly after atoms
Templates    ████████████████░░░░  Production early (low complexity)
Organisms    ██████████░░░░░░░░░░  Production once APIs stabilize
Pages        ██████░░░░░░░░░░░░░░  Production last
```

Templates often reach production quality quickly despite being Level 4 because they contain no business logic. Pages are always last because they depend on every other level being stable.

---

## What Gets Added at Each Transition

### POC to Prototype

| What | Why Now |
|------|---------|
| Design tokens (real values, not hardcoded) | Components must look like the actual product for user testing |
| `input()`/`output()` contracts on molecules | Organisms need stable interfaces to compose against |
| Loading, empty, and error states | Test users will encounter these; hardcoded data hid them |
| Mocked API services | Organisms need realistic data flow without waiting for backend |
| Basic keyboard navigation | Usability testing exposes interaction gaps immediately |
| Design spec extension (loading/empty/error visuals) | Organisms need designed states, not developer-invented ones |

**Tooling decisions at this transition:** The prototype stage is when token pipeline tooling (Tokens Studio + Style Dictionary or PrimeOne Theme Designer), API mocking (MSW), and component development tooling (Storybook) should be evaluated and adopted. See [11-prototype-solutions](./11-prototype-solutions.md) for evaluated options.

### Prototype to Production

| What | Why Now |
|------|---------|
| Real API integration | Mocked data hides latency, error shapes, and auth complexity |
| Automated tests (unit, integration, E2E as needed) | Manual QA does not scale; regressions must be caught automatically |
| Performance budgets (bundle size, render time) | Real data volumes expose performance cliffs |
| Full accessibility compliance | Legal and ethical requirement; cannot ship without it |
| Error boundaries and fallback UI | Real users encounter failures that test users were shielded from |
| Dark mode, RTL, print styles (if required) | Full audience support required at launch |

---

## What Gets Changed at Each Transition

### POC to Prototype

| Aspect | From | To |
|--------|------|----|
| Data source | Hardcoded inline values | Mocked services returning realistic payloads |
| Component API | Ad-hoc props, whatever works | Defined `input()`/`output()` contracts |
| Styling | Default PrimeNG theme | Real design tokens applied |
| Layout | Fixed-width, single breakpoint | Responsive, tested at target breakpoints |
| Review process | "Does it render?" | "Can a user complete the task?" |

### Prototype to Production

| Aspect | From | To |
|--------|------|----|
| Data source | Mocked services | Real API calls with auth, pagination, caching |
| Error handling | `console.log` or silent failure | User-facing error states, retry logic, fallback UI |
| Test coverage | Manual walkthroughs | Automated unit, integration, E2E, visual regression |
| Accessibility | Basic keyboard nav, manual checks | axe-core in CI, screen reader tested, ARIA complete |
| Performance | "Seems fast enough" | Measured against budgets, optimized |

---

## What Gets Thrown Away at Each Transition

### POC to Prototype

| What | Why |
|------|-----|
| Hardcoded data fixtures | Replaced by mocked services that mimic real API shape |
| Exploratory layout experiments | Replaced by the layout approach that won |
| Components built to test feasibility, not to reuse | Rebuilt with proper API contracts |

### Prototype to Production

| What | Why |
|------|-----|
| Mocked API services | Replaced by real API integration |
| Test-only shortcuts (e.g., hardcoded auth tokens) | Replaced by real auth flow |
| Prototype-specific workarounds | Replaced by proper implementations now that constraints are understood |
| Components that user testing revealed were unnecessary | Scope refined by real feedback |

### What survives both transitions

| What Survives | Why It Persists |
|---------------|----------------|
| Component file structure and naming conventions | Established at POC, refined but not replaced |
| Design token variable names | Names are agreed early; values change, names persist |
| Angular module/component hierarchy | The atomic cascade is structural; it does not change between stages |
| Route configuration | Routes are defined at POC; guards and resolvers are added, but paths remain |

---

## Tooling Exploration Timeline

Tooling decisions are not prerequisites. They happen as the team learns what it needs.

**POC** -- Explore and spike. Try PrimeNG theming with `definePreset()`. See if Storybook adds value for your team. Test Figma MCP for token extraction. The goal is to learn, not to commit.

**Prototype** -- Decide and standardize. Pick the token pipeline (Figma export, Style Dictionary, or manual). Choose a test framework. Decide on an API mocking approach (MSW, simple interceptors, or hand-rolled stubs). These decisions stick because the team now has enough context to make them well.

**Acceptance criteria before code.** At prototype stage, write Given/When/Then acceptance criteria for each organism and user journey before implementation begins. This shift-left practice forces completeness — without criteria, developers implement 2 states (data + loading) and call it done. With criteria, all states are specified and testable. Storybook play functions can serve as executable forms of these criteria.

**Production** -- Automate what hurts. Add CI checks for whatever keeps breaking. Add visual regression testing if design drift is a problem. Add bundle analysis if size is a concern. The rule: add tooling when the pain justifies it, not because a checklist says to.

---

## Cross-References

- For the atomic hierarchy that defines each level, see [01-atomic-hierarchy.md](./01-atomic-hierarchy.md).
- For how the three streams converge, see [05-parallel-development.md](./05-parallel-development.md).
- For QA criteria and automation potential per atomic level, see [04-qa-per-atomic-level.md](./04-qa-per-atomic-level.md).
- For risks to explore at each stage, see [07-derisking.md](./07-derisking.md).
- For certification gates and CI pipeline, see the gates section in [04-qa-per-atomic-level.md](./04-qa-per-atomic-level.md).
