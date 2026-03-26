# Documentation

Process documentation for building Angular 21 + PrimeNG atomic design systems, paired with findings from a working prototype simulation.

## Start Here

Read [00-quickstart](./00-quickstart.md) — it takes 2 minutes and routes you by role.

## Process Guides

### Foundations (read first, in order)

| # | Doc | What it answers | Read time |
|---|-----|-----------------|-----------|
| 00 | [Quickstart](./00-quickstart.md) | Where do I start? | 2 min |
| 01 | [Atomic Hierarchy](./01-atomic-hierarchy.md) | What are atoms, molecules, organisms? | 10 min |
| 02 | [Maturity Stages](./02-maturity-stages.md) | What quality level should I target now? | 10 min |
| 03 | [Project Structure](./03-project-structure.md) | Where do files go? How are they named? | 8 min |

### Building (read based on your current work)

| # | Doc | What it answers | Read time |
|---|-----|-----------------|-----------|
| 04 | [Parallel Development](./04-parallel-development.md) | How do design and dev work together? | 8 min |
| 05 | [Token Pipeline](./05-token-pipeline.md) | How do design tokens flow from Figma to code? | 10 min |
| 06 | [Tooling Landscape](./06-tooling-landscape.md) | Which tools should we adopt and when? | 5 min |
| 07 | [QA Per Atomic Level](./07-qa-per-atomic-level.md) | How do I test and certify a component? | 12 min |
| 08 | [PBI and BA Guide](./08-pbi-and-ba-guide.md) | How do I write PBIs? Where does the BA add value? | 12 min |

### Reference (read when a specific question arises)

| # | Doc | What it answers | Read time |
|---|-----|-----------------|-----------|
| 09 | [Angular Direction](./09-angular-direction.md) | What Angular 21 features affect my architecture? | 10 min |
| 10 | [De-risking](./10-derisking.md) | What risks will I hit and how do I handle them? | 8 min |
| 11 | [Implementation Tips](./11-implementation-tips.md) | What are the practical gotchas and solutions? | varies |

## Prototype Findings

Results from a simulated prototype build using this process.

**Specification**
- [design-spec.md](./design-spec.md) — Simulated Figma design handoff values
- [design-spec-prototype.md](./design-spec-prototype.md) — Extended spec for loading/error/empty states
- [assumptions.md](./assumptions.md) — Decisions made during simulation

**Results**
- [simulation-report.md](./simulation-report.md) — Full report: hypotheses, findings, lessons learned
- [acceptance-criteria.md](./acceptance-criteria.md) — Given/When/Then criteria per component
- [manual-test-checklist.md](./manual-test-checklist.md) — Browser verification checklist

**Next Steps**
- [production-plan-sketch.md](./production-plan-sketch.md) — Sketch of production-stage scope

## Reading Path by Role

- **Developer (new):** 00 → 01 → 02 → 03 → 11 → explore `src/`
- **Developer (prototype):** above + 05 → 07 → 10
- **BA / Product Owner:** 00 → 01 → 02 → 08 → acceptance-criteria
- **Designer:** 00 → 01 → 05 → 04 → design-spec
- **Tech Lead:** 00 → 01 → 02 → 06 → simulation-report
