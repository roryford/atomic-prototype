# BA Guide: Where Business Analysis Adds Value

Lessons from the prototype simulation on where a BA is most needed in the atomic design process.

---

## The Core Problem This Solves

The simulation found that design specs cover the "happy path" (data-loaded state) only. Loading, empty, error, and edge-case states were invented by the developer. 9 out of 12 organism state renderings had no design backing. A BA sitting between design and dev would have caught these gaps before code was written.

---

## Where a BA Adds Value

### 1. State Discovery (highest impact)

Before any PBI is written, walk through each organism and ask:
- What happens when there's no data?
- What happens when the API fails?
- What happens when it's loading?
- What happens when a search returns nothing?
- What happens when one API succeeds and another fails?

Produce a **state matrix** per organism:

| Organism | Loading | Error | Empty | Data | Search-No-Results | Partial Failure |
|----------|---------|-------|-------|------|-------------------|-----------------|
| StatGrid | 4 skeletons | Message + retry | "No stats" | Stat cards | N/A | N/A |
| ProjectTable | 5 skeleton rows | Message + retry | "No projects" | Sortable table | "No results for X" | N/A |
| Dashboard (page) | Both loading | Both error | Both empty | Both data | N/A | Stats OK, projects error |

Flag states that need designer input before the PBI is ready for dev.

### 2. Acceptance Criteria Authoring

Own the acceptance criteria. Write them from the user's perspective, not the component's.

**Developer-written:** "GIVEN search with no matches, THEN show empty state"
**BA-written:** "GIVEN a user searching for a project that doesn't exist, WHEN they see no results, THEN they should understand why and know how to recover (clear search button visible)"

The difference: the BA criterion includes the user's mental model and recovery path.

### 3. Design-Dev Handoff Gap

Maintain a **design questions log** — every time dev encounters a state the design doesn't cover:

| Date | Component | Question | Asked To | Answer | Updated In |
|------|-----------|----------|----------|--------|------------|
| Mar 22 | ProjectTable | What does search-no-results look like? | Designer | pi-search icon + "No results" + Clear button | PBI #42, design-spec-prototype.md |
| Mar 23 | Dashboard | What happens when stats fail but projects load? | Designer | Show error in stats section only | PBI #38, acceptance-criteria.md |

For a 2-4 person team, this doesn't need a tool — a shared doc or Slack thread that the BA owns is enough.

### 4. Shared Model / Interface Definition

Define the canonical data model EARLY:
- What fields does a "Project" have? What types? Required vs optional?
- Does the API return this shape, or does the frontend transform it?
- Align with backend before dev starts building to the model.

The prototype found `Project` defined differently in two pages. The BA would have caught this by owning the model definition.

### 5. User Journey Definition

Define user journeys BEFORE component PBIs:
- Journey 1: Browse Projects (Dashboard → card click → Detail → Back)
- Journey 2: Search and Filter (List → search → filter → View → Detail)
- Journey 3: Handle Errors (/detail/999 → error → navigate back)

Map each journey to components it touches. Use journeys to prioritize PBIs — components in Journey 1 are higher priority than Journey 3-only components.

### 6. Scope Control

For each PBI, explicitly define what's in scope and what's deferred:
- "DsButton exposes: label, severity, outlined. NOT: icon, loading, size (add when needed)"
- Apply the test: "Does this input ship screens faster?" If no, defer it.

---

## Where a BA is NOT Needed

- Token mapping (design-spec → definePreset) — pure technical work
- Folder structure / architecture decisions
- Tooling setup (Storybook, MSW, Stylelint)
- Test implementation
- CSS / responsive implementation (as long as requirements specify breakpoints)

---

## BA's Rhythm in the Sprint

| When | What | Output |
|------|------|--------|
| Sprint planning | Review PBIs for completeness, flag missing states | Updated PBIs with all states |
| Before dev starts a PBI | Confirm design spec covers all states in the PBI | Design questions log entries |
| During dev | Answer "what should happen when...?" questions | Updated acceptance criteria |
| Before PR review | Verify acceptance criteria are met, not just "it builds" | Journey walkthrough notes |
| Retrospective | Log which states were discovered during dev (not before) | Process improvement items |

---

## The Line: Where BA Matters Most

**Atoms and molecules** are technical PBIs that developers can write. The component API is the requirement.

**Organisms and pages** are user-facing PBIs that need BA involvement. This is where states, journeys, error recovery, and user intent matter.

The line maps to the atomic cascade rule — below the organism boundary is "dumb UI," above it is "smart features" where requirements drive design.
