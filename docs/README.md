# Docs Index

This folder contains both process documentation for building Angular 21 + PrimeNG atomic design systems (docs 00-12) and findings from a working prototype simulation. The process guides are reusable across projects; the prototype findings are specific to the dashboard simulation built in this repo.

## Start Here

Begin with [00-quickstart.md](./00-quickstart.md) -- it routes readers by role (developer, BA, designer) and provides a recommended reading order.

## Process Guides

0. [00-quickstart](./00-quickstart.md) -- Entry point and reading order
1. [01-atomic-hierarchy](./01-atomic-hierarchy.md) -- Five-level component taxonomy (atoms through pages)
2. [02-tooling-landscape](./02-tooling-landscape.md) -- Locked stack vs optional tools
3. [03-token-pipeline](./03-token-pipeline.md) -- Design tokens from Figma to code
4. [04-qa-per-atomic-level](./04-qa-per-atomic-level.md) -- QA checklists and testing per level
5. [05-parallel-development](./05-parallel-development.md) -- Design and dev running together
6. [06-maturity-stages](./06-maturity-stages.md) -- POC, Prototype, Production definitions
7. [07-derisking](./07-derisking.md) -- 14 build-time risks and when to spike
8. [08-project-structure](./08-project-structure.md) -- Directory layouts and file naming
9. [09-angular-direction](./09-angular-direction.md) -- Angular 21 features, signals, httpResource
10. [10-implementation-tips](./10-implementation-tips.md) -- Practical gotchas from simulation
11. [11-prototype-solutions](./11-prototype-solutions.md) -- MSW, Storybook, bundle optimization
12. [12-pbi-writing-guide](./12-pbi-writing-guide.md) -- PBI templates and BA involvement

## Prototype Findings

**Specification**
- [design-spec.md](./design-spec.md) -- Original design specification
- [design-spec-prototype.md](./design-spec-prototype.md) -- Prototype-specific design spec
- [assumptions.md](./assumptions.md) -- Assumptions made during simulation

**Findings**
- [simulation-report.md](./simulation-report.md) -- Full simulation report
- [findings.md](./findings.md) -- Key findings and observations
- [lessons-learned.md](./lessons-learned.md) -- Lessons learned across the build

**Quality**
- [acceptance-criteria.md](./acceptance-criteria.md) -- Acceptance criteria per component
- [manual-test-checklist.md](./manual-test-checklist.md) -- Manual verification checklist

**Guides**
- [ba-guide.md](./ba-guide.md) -- Where business analysis adds value
- [pbi-templates.md](./pbi-templates.md) -- PBI worked examples by atomic level

**Next Steps**
- [production-plan-sketch.md](./production-plan-sketch.md) -- Sketch of production-stage scope

## Reading Path by Role

- **Developer:** 00 → 01 → 08 → 09 → 10 → then explore `src/`
- **BA:** 00 → 01 → 12 → ba-guide → acceptance-criteria → 04
- **Designer:** 00 → 01 → 03 → design-spec → design-spec-prototype → 05
