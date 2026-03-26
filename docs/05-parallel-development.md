# Parallel Development: Design and Dev Run Together

Design is not a phase before dev. On a small team (2-4 people), all streams run in parallel from day one. The words POC, Prototype, and Production describe the **maturity of each stream's output**, not sequential phases separated by handoffs.

---

## The Reality: Design and Dev Run Together

Everyone is in the same standup. Convergence is not a scheduled checkpoint — it is continuous. A designer refining tokens, a developer wiring organisms, and a backend engineer drafting endpoints are all working at the same time, talking to each other as questions come up.

The maturity stages describe where each stream's output sits right now, not what order work happens in. A stream can jump from POC to Production on one component while another component is still being explored. Maturity is per-component, not per-project.

```
Maturity ──────────────────────────────────────────────────────────►

                  POC              Prototype           Production
               (explore)          (validate)            (harden)
            ┌──────────────┬──────────────────┬──────────────────────┐
  Design    │ Rough comps, │ Hi-fi screens,   │ Final specs,         │
            │ token sketch │ interaction docs  │ full token coverage  │
            ├──────────────┼──────────────────┼──────────────────────┤
  Dev       │ Atom wraps,  │ Organisms wired, │ All states, a11y,    │
            │ spike builds │ mocked data      │ perf, prod pipeline  │
            ├──────────────┼──────────────────┼──────────────────────┤
  Backend   │ Entity model │ Draft endpoints, │ Contracted APIs,     │
            │ sketches     │ sample payloads  │ versioned, monitored │
            └──────────────┴──────────────────┴──────────────────────┘
```

Each stream's maturity advances independently. It is normal for dev to be at prototype maturity on atoms while design is still at POC on organism layouts. That is fine — the team is small enough to course-correct in conversation.

**Why this works on a small team:** The traditional waterfall concern — "what if dev builds the wrong thing?" — is addressed not by sequencing but by proximity. When the designer sits in the same standup as the developer, maximum drift is a day or two, not weeks. You do not need formal gates to catch misalignment. You need people who talk to each other.

---

## Early Alignment (Week 1)

Not a meeting. Things the team should discuss early, even informally:

- **Shared vocabulary.** Agree on what "atom," "molecule," and "organism" means for your project. If design calls something a "card" and dev calls it a "tile," you will waste time later. Write the agreed names somewhere everyone can see — a pinned Slack message, a Figma page title, whatever sticks.
- **PrimeNG fit.** Does the design language work with PrimeNG's Aura preset, or fight it? Spike the riskiest components in the first few days. If a custom date picker is going to take a week, everyone should know that now, not in week three.
- **Responsive approach.** Reflow (CSS grid/flex adjustments at breakpoints) or restructure (different DOM for mobile)? This decision affects component architecture deeply — a reflow approach means one component with CSS variations, while restructure may mean separate mobile templates.
- **Canonical breakpoints.** Settle on a single set of breakpoints in Week 1. These values are a starting point — adjust based on the actual design:

  | Name | Width | Columns |
  |------|-------|---------|
  | Mobile | < 640px | 1 |
  | Tablet | 640px -- 1023px | 2 |
  | Desktop | 1024px -- 1439px | 3 |
  | Wide | >= 1440px | 4 |

  Define these as SCSS variables or CSS custom properties once, then reference them everywhere. If design and dev use different breakpoints, every responsive bug becomes a guessing game.
- **What is settled vs. still moving.** Which parts of the design are safe to build to production quality? Which are still being explored? This does not need to be a maintained document — a sticky note on the wall, a Figma annotation, or a quick list in chat is enough. The point is shared understanding, not an artifact.

Example of a "settled vs. moving" list (this can literally be a sticky note):

```
Settled:     Nav bar, login form, dashboard grid layout
In progress: Card component (close, minor tweaks expected)
Exploring:   Settings page (two approaches being tested)
Not started: Search results
```

Dev should build settled areas to production quality, in-progress areas to prototype quality, and exploring areas to POC quality at most. This prevents the most common source of rework: polishing something that is about to change.

- **BA involvement for organisms and pages.** Atoms and molecules are technical components where the API is the requirement -- developers can write these PBIs. Organisms and pages are user-facing -- they need someone (a BA, product owner, or the designer themselves) to elicit missing states before PBIs are written. Walk through each organism asking: "What happens when there's no data? When the API fails? When a search returns nothing? When one API succeeds and another fails?" Capture answers in a state matrix and route unanswered questions to the designer.

These four topics do not require a formal kickoff meeting. They can happen over coffee, in a Slack thread, or in the first standup. The point is that all 2-4 people leave week one with the same mental model of what they are building and which parts are safe to invest in.

---

## Ongoing Practices

| Practice | What It Is | Effort |
|---|---|---|
| Token sync | Designer updates Figma, dev re-exports tokens | As needed |
| Missing states flagging | Dev flags "I need empty/error/loading for X" to designer | As it comes up |
| API shape co-design | Dev writes TypeScript interfaces, backend confirms | Continuous |
| Storybook as shared surface | Designer reviews built components in Storybook | Weekly or per-PR |
| Bundle awareness | Run production build, check size is not growing fast | Weekly, 5 min |
| A11y as you go | Quick keyboard + screen reader test per organism | Per organism, 10 min |
| Weekly prod build | Actually build and deploy to catch integration issues early | Weekly via CI |

**Design spec extension at prototype.** The POC design spec covers the happy path (data-loaded state) only. At prototype, the designer must extend the spec with: loading skeleton shapes and dimensions per organism, empty state layout (icon, message, action), error state patterns (message copy, retry affordance), interaction states (hover, focus, disabled), and specs for new components (e.g., SearchBar, FormField). Without this extension, developers will invent these states -- which validates their guesses, not the design.

None of these require a formal process. On a 2-4 person team, most happen as side conversations during the work.

**How to read this table:** The "Effort" column is the ongoing cost, not the setup cost. Token sync takes a few minutes when it happens. A11y testing takes 10 minutes per organism but prevents weeks of retrofit later. Bundle awareness is a single CLI command (`ng build --configuration production`) followed by a glance at the output size.

---

## Designer's Storybook Review

What does it actually look like when a designer reviews components in Storybook?

1. **Open the Storybook URL.** Deployed (CI publishes a preview on each PR) or run locally with `npm run storybook`. If CI deploys it, the PR will have a link — click it and you are there.
2. **Navigate by atomic level.** Atoms, molecules, organisms — each has its own section in the sidebar. Start at the level you care about.
3. **Use Controls/Args to switch between variants.** The Controls panel at the bottom lets you toggle props like `disabled`, `loading`, `error`, change text content, and resize the viewport — all without touching code.
4. **Compare against Figma side-by-side.** Open the Figma component in one window, the Storybook story in another. Look for spacing differences, color mismatches, and missing states. Pay special attention to edge cases: long text, empty content, error messages.
5. **Leave feedback.** On a small team, just talk — walk over or send a message. For async work, comment directly on the PR that deployed the Storybook preview. Keep it specific: "the spacing between the icon and label is 12px in Figma but looks like 8px here" is actionable. "This looks off" is not.

The goal is not pixel-perfect sign-off. It is catching drift early: "this loading state is not what I designed" or "we are missing the empty state entirely."

**What to look for specifically:**
- Do colors and spacing match the design tokens, or has something been hardcoded?
- Are all the states present (default, hover, focus, disabled, loading, error, empty)?
- Does the component respond to viewport changes the way the design intended?
- Is the interaction behavior (click, keyboard, focus order) what was designed?

A five-minute Storybook walkthrough per component catches more issues than a one-hour spec review after the fact.

---

## Feedback Between Streams

At 2-4 people, feedback is a conversation, not a workflow. There is no ticket system for "designer owes dev an empty state." You just talk about it and it gets done.

**The common loop:** Dev hits a missing state — "Hey, this empty state is not designed yet." Designer adds it in Figma, maybe updates a token. Dev picks it up. Done. Total elapsed time: hours, not days.

**With Figma MCP (if adopted):** Dev can push rendered UI back to Figma for structured comparison. The designer sees actual output next to their intent, not a screenshot.

**Without tooling:** A screenshot in Slack or a PR comment works fine. The important thing is that the feedback happens, not how it is formatted.

**The reverse loop matters most.** The most expensive gap in any design-dev workflow is "dev finds something design missed." Without a habit of flagging these findings back, they get lost — dev invents a solution, design never knows, and the two diverge. On a small team this is easy to fix: just say it out loud.

### Key feedback patterns by level

| Level | Common Feedback | Typical Resolution |
|---|---|---|
| Atom | Token value looks wrong, focus ring missing, contrast fails | Update token in Figma, re-export — fix cascades everywhere |
| Molecule | Spacing off, loading state not designed, keyboard order wrong | Designer adds state, dev adjusts DOM or spacing token |
| Organism | Layout breaks at viewport, empty state missing, error UX unclear | Designer refines pattern, dev implements |
| Page | Real data overflows layout, flow breaks at integration point | Trace to lowest responsible level, fix there |

### Why shift-left matters

Fixing a token at the atom level fixes every molecule, organism, and page that uses it — automatically. The same problem caught at the page level requires a root-cause investigation, a cascading fix, and a full regression review. Catch things as low as possible.

This is the single biggest advantage of the atomic hierarchy in a parallel workflow: a fix at the bottom propagates upward for free. A fix at the top requires tracing downward through every layer. When you find a problem, always ask "what is the lowest level where this can be fixed?"

```
Fix at Atom level    → cascades up to Molecules, Organisms, Pages for free
Fix at Molecule level → cascades up to Organisms, Pages
Fix at Organism level → only fixes that Organism
Fix at Page level     → fixes nothing else; you will do it again next time
```

---

## Anti-Patterns

| Anti-Pattern | What Goes Wrong |
|---|---|
| Dev invents missing states without telling designer | Design and code diverge silently; designer discovers it weeks later |
| Designer redesigns settled components without telling dev | Dev throws away working code; trust erodes |
| Team builds molecules before discovering them from screens | Molecules get invented speculatively instead of emerging from real organism needs |
| "We will add a11y before launch" | Structural a11y issues require component rewrites, not a quick fix |
| "Backend will figure out the API later" | Frontend builds to assumptions, rewrites when real API arrives |
| Skipping Storybook review for weeks | Drift between design and code compounds silently; one big review is demoralizing |

The common thread: anti-patterns on a small team are almost always communication failures, not process failures. If something looks wrong, say it now. Do not wait for a review cycle.

---

## This Is Not Big Design Up Front

Nothing in this document says "design everything before writing code." It says: start everything early, keep it rough, converge through conversation. The maturity labels exist so the team can have an honest conversation about quality expectations — "this is POC quality, do not file bugs against it yet" — without needing a phase gate.

On a 2-4 person team, the process is the people. Keep talking. Keep showing each other work. The practices above just give you a shared language for what to show and when.

---

## Cross-References

- For what to build at each maturity level, see [06-maturity-stages.md](./06-maturity-stages.md).
- For risks to surface early, see [07-derisking.md](./07-derisking.md).
