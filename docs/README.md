# Documentation

> **Prototype — educational use only.** These docs describe a reference implementation.
> Code patterns and APIs may not reflect production best practices in all cases.

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
| 06 | [Tooling Landscape](./06-tooling-landscape.md) | Which tools should we adopt and when? | 8 min |
| 07 | [QA Per Atomic Level](./07-qa-per-atomic-level.md) | How do I test and certify a component? | 12 min |
| 08 | [PBI and BA Guide](./08-pbi-and-ba-guide.md) | How do I write PBIs? Where does the BA add value? | 12 min |

### Reference (read when a specific question arises)

| # | Doc | What it answers | Read time |
|---|-----|-----------------|-----------|
| 09 | [Angular Direction](./09-angular-direction.md) | What Angular 21 features affect my architecture? | 10 min |
| 10 | [De-risking](./10-derisking.md) | What risks will I hit and how do I handle them? | 8 min |
| 11 | [Implementation Tips](./11-implementation-tips.md) | What are the practical gotchas and solutions? | varies |
| 12 | [Decision Guides](./12-decision-guides.md) | How do I make key architectural and process decisions? | 15 min |
| 13 | [Designers Guide](./13-designers-guide.md) | How does a designer work in this process? | 15 min |
| 14 | [Replication Guide](./14-replication-guide.md) | How do I replicate this approach on a new project? | 12 min |

## Prototype Findings

Results from a simulated prototype build using this process.

**Visual Reference**
- [component-catalogue.md](./component-catalogue.md) — Screenshots of every component at every atomic level

**Specification**
- [design-spec.md](./design-spec.md) — Simulated Figma design handoff values (includes prototype extensions for loading/error/empty states)

**Results**
- [simulation-report.md](./simulation-report.md) — Full report: hypotheses, findings, lessons learned
- [acceptance-criteria.md](./acceptance-criteria.md) — Given/When/Then criteria per component
- [manual-test-checklist.md](./manual-test-checklist.md) — Browser verification checklist

**Next Steps**
- [production-plan-sketch.md](./production-plan-sketch.md) — Sketch of production-stage scope

## Reading Path by Role

- **Developer (new):** 00 → 01 → 02 → 03 → 11 → explore `src/`
- **Developer (prototype):** above + 05 → 07 → 10
- **BA / Product Owner:** 00 → 01 → 02 → 08 → 10 → 12 → acceptance-criteria
- **Designer:** 00 → 13 → 01 → 05 (tokens section) → 04 → component-catalogue
- **Evaluator (deciding whether to adopt):** 00 → simulation-report → 02 → 10 → 12
- **Tech Lead:** 00 → 01 → 02 → 06 → simulation-report
