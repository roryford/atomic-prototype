# Writing PBIs for Atomic Design

> For concrete examples from the prototype simulation, see [pbi-templates](./pbi-templates.md).

Guide for writing Product Backlog Items at each atomic level. Based on learnings from POC and prototype simulations.

→ see 01-atomic-hierarchy for level definitions, 04-qa-per-atomic-level for QA criteria

---

## Key Principles

1. **Bottom up.** Write atom PBIs before molecule PBIs, molecule before organism, organism before page. Each level references the one below.
2. **Acceptance criteria before code.** Given/When/Then criteria written before implementation force completeness. Criteria written after code just describe what was built.
3. **Reference shared models.** "Uses `Project` from `models/`" — don't redefine interfaces in each PBI.
4. **Include what's NOT in scope.** "Inputs: label, severity, outlined. NOT: icon, loading, size." Prevents gold-plating.
5. **State before visual.** List all states, then reference the design spec for how each looks.

---

## PBI by Level

### Atoms

**Required:** component name, selector, which PrimeNG component it wraps, inputs with exact types (use union types not `string`), outputs, visual states (default/hover/focus/disabled), token compliance.

Atoms are technical PBIs — developers can write these without BA involvement.

**Common mistake:** Using `severity: string` instead of `severity: 'success' | 'info' | 'warn' | 'danger'`. PrimeNG uses union types; widening to string causes type errors at the binding site.

### Molecules

**Required:** component name, selector, which atoms it composes, input/output contract (this is the API organisms depend on), interaction behavior (Enter/click/blur — not just visuals).

Molecules are technical PBIs. The interaction spec is the part most often missing — "Enter key triggers search" must be explicit, not assumed.

### Organisms

**Required:** component name, selector, which molecules/atoms it composes, data interface (reference shared model), inputs (data + isLoading + error), outputs (user actions), ALL states with visual reference, responsive column counts per breakpoint, keyboard nav, who designed the non-data states.

Organisms can either inject services directly (→ see 01-atomic-hierarchy § Level 3) or receive data as inputs from the page. Both patterns are valid — injecting services makes organisms self-contained, while input-driven organisms are more reusable and easier to test. The PBI should specify which pattern this organism uses.

**This is where PBIs fail.** The prototype simulation found that without explicit state specs, developers implement 2 states (data + loading) and call it done. A complete organism PBI lists:

| State | What it shows | Design spec reference |
|-------|--------------|----------------------|
| Loading | Skeleton shapes matching data layout | design-spec § Loading |
| Error | Message copy + retry affordance | design-spec § Error |
| Empty | Icon + message + optional action | design-spec § Empty |
| Data | Full component rendering | design-spec § [Component] |
| Search-no-results | "No results for [query]" + Clear | design-spec § Search |

Organisms need BA involvement — someone must elicit missing states before the PBI is written.

### Templates

**Required:** component name, selector, named ng-content slots with purpose, layout inputs (NOT data), responsive behavior per breakpoint, landmark roles, explicit constraint (no data binding, no services).

Templates are simple to spec but impactful if wrong — a broken template breaks every page using it.

### Pages

**Required:** route path + params, which template, which organisms composed into it, which services injected, which user journey it enables, error handling (404, auth failure).

Page PBIs should reference journeys, not just list components. Write page PBIs last — they can't be specified until organisms exist.

**Common mistake:** Putting data logic in the page PBI. If the PBI says "filter projects by search term," that belongs in the organism PBI. Pages wire services to organisms — they don't contain logic.

---

## BA Involvement

| Level | BA needed? | Why |
|-------|-----------|-----|
| Atoms | No | API is the requirement |
| Molecules | No | Interaction spec is technical |
| Organisms | **Yes** | States, error recovery, user intent |
| Templates | No | Layout is structural |
| Pages | **Yes** | Journeys, error handling, navigation |

**What the BA does for organisms:**
- Walk through the state matrix: "What happens when there's no data? When the API fails? When a search returns nothing?"
- Write acceptance criteria from the user's perspective, not the component's
- Maintain a design questions log — track what the designer needs to specify
- Verify acceptance criteria during PR review, not just "it builds"

---

## Acceptance Criteria Format

```
GIVEN [precondition]
WHEN [action or event]
THEN [expected outcome]
```

**Atom example:**
```
GIVEN severity="danger", WHEN rendered, THEN shows danger-colored button
```

**Organism example:**
```
GIVEN search typed "zzzzz", WHEN no matches, THEN shows "No results for 'zzzzz'" with Clear button
```

**Journey example:**
```
GIVEN /api/stats fails but /api/projects succeeds,
WHEN dashboard loads,
THEN stats section shows error+retry, projects section renders normally
```

---

## State Discovery Checklist

Before writing an organism PBI, ask:

- [ ] What does loading look like? (skeleton shape, count, dimensions)
- [ ] What does error look like? (message copy, retry affordance)
- [ ] What does empty look like? (icon, message, create action?)
- [ ] Is search-no-results distinct from empty?
- [ ] Can this organism partially fail? (one data source fails, another succeeds)
- [ ] What does slow loading look like? (3-second delay — is skeleton sufficient?)
- [ ] What does stale data during reload look like?
- [ ] Who designed these states? (reference design spec or flag for designer)

---

## Cross-References

- For atomic level definitions, see [01-atomic-hierarchy](./01-atomic-hierarchy.md)
- For QA criteria per level, see [04-qa-per-atomic-level](./04-qa-per-atomic-level.md)
- For prototype-stage tooling, see [11-prototype-solutions](./11-prototype-solutions.md)
- For implementation tips, see [10-implementation-tips](./10-implementation-tips.md)
