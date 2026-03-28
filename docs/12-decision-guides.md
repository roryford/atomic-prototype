# Decision Guides

> **When to read:** When you are stuck at a fork in the road. This doc does not teach concepts -- it assumes you have read the foundational docs and need help making a specific decision. Read time: ~15 minutes (or jump to the section you need).

These decision guides exist to reduce debate time, create consistent outcomes across the team, and prevent rework caused by ambiguous classifications. When two developers disagree on whether something is an atom or a molecule, or when the team is unsure which token pipeline to adopt, these structured trees give everyone the same path to an answer. The result is faster decisions and fewer "we should have done it the other way" reversals.

These guides cover the five most common ambiguity points encountered during the prototype simulation. Each one gives you a structured path from question to answer.

---

## 1. Hierarchy Classification -- "Is this an atom, molecule, or organism?"

Use this tree when you have a new component and are unsure where it belongs. Start at the top and follow the first branch that matches.

```
Does it wrap a single PrimeNG primitive or native HTML element?
  |
  +-- YES --> Does it have pTemplate, internal state management, or render outside the component tree (overlay)?
  |             |
  |             +-- YES --> It is an ORGANISM PRIMITIVE (configure at organism level)
  |             |           Examples: p-table, p-tree, p-calendar, p-dialog, p-editor
  |             |
  |             +-- NO  --> It is an ATOM
  |                         Examples: DsButton (p-button), DsInput (p-inputtext), DsBadge (p-badge)
  |
  +-- NO  --> Does it compose 2-4 atoms into a single reusable unit?
                |
                +-- YES --> Does it fetch data, inject services, or manage global state?
                |             |
                |             +-- YES --> It is an ORGANISM (even if it is small)
                |             |
                |             +-- NO  --> It is a MOLECULE
                |                         Examples: DsSearchBar (Input + Button), DsStatCard (Label + Value + Icon)
                |
                +-- NO  --> Does it compose molecules/atoms with real data and state management?
                              |
                              +-- YES --> It is an ORGANISM
                              |           Examples: DsProjectTable, DsStatGrid
                              |
                              +-- NO  --> Does it define layout via ng-content slots with zero data?
                                            |
                                            +-- YES --> It is a TEMPLATE
                                            |
                                            +-- NO  --> Does it wire services to organisms via a route?
                                                          |
                                                          +-- YES --> It is a PAGE
                                                          +-- NO  --> Re-evaluate. It may need to be split.
```

### Gray Zones

These components do not fit neatly into one level. The prototype established these rulings:

| Component | Ruling | Rationale |
|-----------|--------|-----------|
| Dropdown / Select | Atom | PrimeNG provides it as one component. Do not decompose its internal parts (trigger, overlay, option list). Wrap as one atom even though it contains multiple interactive parts. See the compound components section in [01-atomic-hierarchy](./01-atomic-hierarchy.md). |
| Calendar | Organism primitive | Has overlay rendering, complex date state, and internal templating. Configure at the organism level, not wrapped as an atom. |
| Empty State | Atom | Custom atom built from native HTML (icon + message + optional action). PrimeNG does not provide one. Purely presentational, no state. |
| A component with 5+ atoms | Likely organism | If it needs more than 4 atoms, it is probably managing enough complexity to be an organism. Check whether it also manages state -- if yes, definitely an organism. |
| A "smart" molecule candidate | Organism | If a component composes 2-3 atoms but injects a service or fetches data, it is an organism regardless of size. The state boundary, not the atom count, determines the level. |

**Deciding principle:** The state boundary is the hard line. Below organisms = no services, no subscriptions, no global state. Above = real data enters. When in doubt, ask: "Does this component need to know about the outside world?" If yes, it is an organism or higher.

See [01-atomic-hierarchy](./01-atomic-hierarchy.md) for full definitions and the Cascade Rule.

---

## 2. Maturity Stage Transitions -- "Is this component ready to advance?"

Use this scorecard when deciding whether a component (or group of components) should move from one maturity stage to the next. This is not a checklist to file -- it is a conversation tool for the team.

### POC to Prototype Scorecard

| # | Criterion | Pass? |
|---|-----------|-------|
| 1 | Component renders with real design tokens (not hardcoded hex/px values) | |
| 2 | `input()` / `output()` contracts are defined and stable (molecules and above) | |
| 3 | Loading, empty, and error states are identified (organisms) -- even if not all are designed yet | |
| 4 | At least one mocked data source exists (organisms) | |
| 5 | Basic keyboard navigation works (Tab, Enter, Escape where applicable) | |
| 6 | The component has been used in at least one composition at the level above (an atom used in a molecule, a molecule used in an organism) | |

**Threshold:** 5 of 6 criteria must pass. Criterion 2 (API contracts) is mandatory -- it cannot be the one skipped, because organisms depend on it.

**Who decides:** The developer who built it proposes the transition. A second developer reviews. If they disagree, the component stays at POC until the gap is addressed. No manager approval needed.

### Prototype to Production Scorecard

| # | Criterion | Pass? |
|---|-----------|-------|
| 1 | Real API integration (organisms and pages) -- no mocked data in production code | |
| 2 | Automated tests exist: unit tests for atoms/molecules, state tests for organisms, E2E for pages | |
| 3 | axe-core reports zero critical and serious accessibility violations | |
| 4 | All states render correctly: loading, empty, error, populated (organisms) | |
| 5 | Performance is acceptable: no visible jank with realistic data volumes (100+ rows for tables) | |
| 6 | Visual review completed: designer or design-aware reviewer has approved appearance | |
| 7 | Error boundaries work: a failure in this component does not crash the page | |
| 8 | Dark mode renders correctly (if dark mode is in scope) | |

**Threshold:** 7 of 8 criteria must pass. Criteria 1 (real APIs) and 3 (accessibility) are mandatory -- they cannot be the ones skipped.

**Who decides:** The developer proposes. A reviewer checks the scorecard against the PR. The designer confirms criterion 6. If the team disagrees on whether a criterion passes, the component stays at prototype. Disagreement is a signal that the criterion needs clarification, not that the bar should be lowered.

### What happens if the team disagrees

- If one person says "not ready" and can point to a specific failing criterion, the component stays. The burden of proof is on the person proposing advancement.
- If the disagreement is about whether a criterion applies (e.g., "dark mode is not in scope"), resolve the scope question first, then re-evaluate.
- If the disagreement persists after one conversation, timebox it: the component stays at its current stage for the current sprint and is re-evaluated next sprint with new evidence.

See [02-maturity-stages](./02-maturity-stages.md) for full stage definitions and what gets added, changed, and thrown away at each transition.

---

## 3. Token Pipeline Path Selection -- "Which token path should my team use?"

Use this tree to decide which of the three token pipeline paths fits your current situation. The paths are not permanent -- teams move from Path 1 to Path 2 to Path 3 as needs grow.

```
How many design tokens does your project have?
  |
  +-- Fewer than 50 tokens
  |     |
  |     +-- Do tokens change more than once a month?
  |           |
  |           +-- NO  --> PATH 1: Manual
  |           |           Copy values from Figma inspect panel into definePreset().
  |           |           Total effort: minutes per change.
  |           |
  |           +-- YES --> PATH 2: Semi-Automated
  |                       Even with few tokens, frequent changes make manual copy-paste error-prone.
  |
  +-- 50 to 200 tokens
  |     |
  |     +-- Does your team have budget for Tokens Studio Pro or PrimeOne Theme Designer?
  |           |
  |           +-- YES --> PATH 2 with paid tooling
  |           |           PrimeOne Theme Designer auto-generates light/dark presets.
  |           |           Tokens Studio Pro syncs directly to Git.
  |           |
  |           +-- NO  --> PATH 2 with free tooling
  |                       Tokens Studio free tier + Style Dictionary or custom script.
  |                       Developer runs npm run build:tokens after each export.
  |
  +-- More than 200 tokens
        |
        +-- Do multiple contributors change tokens?
              |
              +-- YES --> PATH 3: Automated
              |           CI pipeline runs Style Dictionary on push, opens PRs automatically.
              |
              +-- NO  --> PATH 2: Semi-Automated
                          One person can manage the manual export/build step at this scale.
```

### Recommendation for 2-4 Person Teams

Most small teams should start on **Path 1** during POC and move to **Path 2 (free tooling)** at the prototype stage. Here is why:

- **Path 1** costs zero setup time. At POC you have fewer than 20 tokens and they change rarely. Manual is correct.
- **Path 2 with the custom script option** is the sweet spot for small teams. A 50-80 line Node script that reads Tokens Studio JSON and writes `preset.ts` is faster to build and maintain than configuring Style Dictionary with a custom PrimeNG format. Style Dictionary is more powerful, but that power is wasted if you only have one output target.
- **Path 3** is overkill for a 2-4 person team unless token changes are happening weekly from multiple people. The overhead of CI pipeline configuration and PR automation is not justified until the manual export step is actively causing missed changes.

**Decision rule:** If you are spending more than 30 minutes per design update translating Figma values to code, move to the next path. If not, stay where you are.

See [05-token-pipeline](./05-token-pipeline.md) for implementation details on each path, dark mode rules, and the PrimeNG 3-tier token system. See the Procurement Decision Guide section in [06-tooling-landscape](./06-tooling-landscape.md) for the general "when to add tooling" framework.

---

## 4. Test Type Selection -- "What kind of test should I write for this?"

Use this tree when you are about to write a test and need to decide which type. Start with what you are testing.

```
What are you testing?
  |
  +-- Visual appearance (does it look right?)
  |     |
  |     +-- Is it an atom or molecule?
  |     |     +-- YES --> Storybook story with visual snapshot
  |     |     |           Write a story for each visual state (default, hover, focus, disabled, error).
  |     |     |           If using Chromatic/Percy, snapshots are automatic. Otherwise, manual review.
  |     |     |
  |     |     +-- NO (organism or template) --> Storybook story OR Playwright screenshot
  |     |                                       Organisms need stories for each data state (loading, empty, error, data).
  |     |                                       Templates need responsive snapshots at each breakpoint.
  |     |
  |     +-- Is it dark mode correctness?
  |           +-- Playwright with theme toggle, or Chromatic Modes if available.
  |
  +-- Logic and data flow (does the code do the right thing?)
  |     |
  |     +-- Is it an atom?
  |     |     +-- Unit test (Vitest)
  |     |       Test input/output contract. No mocking needed -- atoms have no dependencies.
  |     |
  |     +-- Is it a molecule?
  |     |     +-- Unit test (Vitest) for validation logic
  |     |     +-- Storybook play function for interaction sequences (type, tab, click)
  |     |
  |     +-- Is it an organism?
  |           +-- Unit test (Vitest) with mock services for state transitions
  |           +-- Test all four states: loading, empty, error, populated
  |           +-- Test transitions: loading-to-populated, error-to-retry
  |
  +-- User interaction (does clicking/typing do what the user expects?)
  |     |
  |     +-- Is it a single component interaction?
  |     |     +-- Storybook play function
  |     |       Simulates click-type-tab sequences in the browser. Catches wiring bugs.
  |     |
  |     +-- Is it a cross-component journey?
  |           +-- Playwright E2E test
  |             Navigate, interact, verify outcome across pages.
  |
  +-- Accessibility (is it usable by everyone?)
  |     +-- axe-core (run at every level, required for certification)
  |     +-- Keyboard navigation (manual check at molecule and organism level)
  |     +-- Screen reader (manual check at page level for production)
  |
  +-- Performance (is it fast enough?)
        +-- Is it a page?
        |     +-- Lighthouse CI: LCP < 2.5s, INP < 200ms, CLS < 0.1
        |
        +-- Is it an organism with large data?
              +-- Profile with Angular DevTools. Verify OnPush. Test with 100+ items.
```

### The PrimeNG jsdom Limitation

PrimeNG's `(onClick)` does not fire from DOM click events in jsdom (the environment Vitest uses). This means:

- **Unit tests cannot verify PrimeNG button clicks.** A `button.click()` in Vitest will not trigger PrimeNG's `(onClick)` handler.
- **Workaround for atoms:** Test the `output()` emission directly by calling the component method, or use `componentRef.instance.clicked.emit()`.
- **Workaround for molecules and organisms:** Use Storybook play functions or Playwright, which run in a real browser where PrimeNG events work correctly.
- **Do not waste time debugging why click tests fail in Vitest.** This is a known limitation, not a bug in your code.

See [07-qa-per-atomic-level](./07-qa-per-atomic-level.md) for the full test type matrix and the PrimeNG Testing Limitation section in that same doc for details.

---

## 5. Role Routing -- "Who owns this decision?"

Use this matrix when a decision needs to be made and it is unclear who should make it. On a 2-4 person team, one person often fills multiple roles. The matrix defines accountability (who decides), not exclusivity (who is allowed to have opinions).

### Responsibility Matrix

| Decision | Accountable | Consulted | Informed |
|----------|-------------|-----------|----------|
| **Component API design** (inputs, outputs, selector) | Developer building it | Reviewer (second dev) | Designer (if API affects Figma structure) |
| **State definition** (which states an organism handles) | BA / product owner | Designer (visual treatment), Developer (feasibility) | Team (via PBI) |
| **Visual QA** (does the component match the design?) | Designer | Developer (implementation constraints) | Reviewer |
| **Acceptance criteria** (Given/When/Then for PBIs) | BA / product owner | Developer (edge cases), Designer (visual states) | Team (via PBI) |
| **Token values** (specific colors, spacing, radii) | Designer | Developer (browser constraints, PrimeNG token paths) | Team (via token export) |
| **Token pipeline path** (manual vs semi-automated vs automated) | Developer (lead) | Designer (workflow impact), Team (effort) | Stakeholders |
| **Priority ordering** (which PBI ships first) | Product owner / BA | Developer (dependencies, risk), Designer (design readiness) | Team (via backlog) |
| **Maturity stage transition** (POC to Prototype, Prototype to Production) | Developer (proposes) + Reviewer (approves) | Designer (visual sign-off for Production) | Team |
| **Atomic level classification** (atom vs molecule vs organism) | Developer building it | Reviewer | Designer (if it changes Figma component structure) |
| **Test strategy** (which tests to write, what to skip) | Developer building it | Reviewer | Team (via PR) |
| **Tooling adoption** (adding Storybook, Chromatic, MSW, etc.) | Team consensus | All roles | Stakeholders (if budget is involved) |
| **Architecture decisions** (folder structure, state management, routing) | Developer (lead) | All developers | Designer, BA |

### How to Read This Matrix

- **Accountable:** This person makes the final call. If no one else has an opinion, this person decides alone.
- **Consulted:** This person's input is sought before the decision. They can raise concerns that the accountable person must address (but not necessarily agree with).
- **Informed:** This person is told after the decision is made. They do not block it.

### Common Scenarios

**"The designer and developer disagree on whether a component is done."**
The designer owns visual QA. If the designer says it does not match the design, the component is not done. The developer can push back if the design is technically infeasible -- in that case, the decision escalates to a conversation (not a veto).

**"No one wrote acceptance criteria and dev already started."**
Stop and write them. The BA (or product owner, or whoever fills that role) writes them retroactively, but flags this in the retrospective. Criteria written after code just describe what was built -- they do not ensure completeness.

**"Two developers disagree on atomic level classification."**
The developer building the component proposes. The reviewer can challenge. Use the decision tree in Section 1 above. If the tree does not resolve it, ask: "Does it manage state?" If yes, it is an organism. If the disagreement persists, choose the higher level (it is easier to simplify later than to promote).

**"The team cannot agree on whether to adopt a tool."**
Tooling adoption requires team consensus. If consensus cannot be reached, the default is to not adopt. The burden of proof is on the person proposing the tool -- they must show that the manual approach is causing measurable pain (see the Procurement Decision Guide section in [06-tooling-landscape](./06-tooling-landscape.md)).

See [08-pbi-and-ba-guide](./08-pbi-and-ba-guide.md) for PBI structure by level and where a BA adds the most value.

---

## Cross-References

- Atomic hierarchy and Cascade Rule: [01-atomic-hierarchy](./01-atomic-hierarchy.md)
- Maturity stage definitions and transition details: [02-maturity-stages](./02-maturity-stages.md)
- Token pipeline paths and dark mode: [05-token-pipeline](./05-token-pipeline.md)
- Tooling adoption framework: [06-tooling-landscape](./06-tooling-landscape.md)
- QA checklists and test type matrix: [07-qa-per-atomic-level](./07-qa-per-atomic-level.md)
- PBI templates and BA involvement: [08-pbi-and-ba-guide](./08-pbi-and-ba-guide.md)
