# Quickstart Guide

> **Who is this for?** Anyone joining this project or evaluating this approach. Read time: 2 minutes.

> **Learning reference, not a framework.** This prototype demonstrates Angular 21 atomic design
> patterns for educational purposes. It is not a library to depend on, not actively maintained
> as open-source, and not a production starter kit. Fork it or follow the
> [replication guide](./14-replication-guide.md) to apply these patterns in your own project.

Start here. This repo contains process documentation for building Angular 21 + PrimeNG 21 applications using Atomic Design principles, targeting small teams (2-4 people).

## Why Atomic Design?

**What it gives you.** On a team of 2-4 developers sharing a codebase, the same problems keep showing up: a button looks one way on the dashboard and another way on the detail page, two people build slightly different search bars in the same sprint, a designer hands off specs that don't map to anything in code, and edge-case states (empty, error, loading) get handled inconsistently -- or not at all. Atomic structure fixes this by giving every component a single home with a clear API. New team members can explore the design system directory and know immediately what's available instead of grepping through pages. The result is less rework, faster PR reviews, and fewer "why does this look different over here?" bugs.

**When NOT to use it.** Be honest with yourself about scope. If you're building a one-page internal tool, a throwaway prototype you won't maintain past next month, or you're a solo developer who already knows every corner of the codebase -- the overhead of atoms/molecules/organisms isn't worth it. Same if the team has zero Angular experience; learn Angular first, then layer on structure. Below roughly 5-10 components, flat organisation is fine.

**Why not just use PrimeNG directly?** You can, and it's faster on day one. The tradeoff hits later. When every page imports PrimeNG components directly, you've coupled your entire app to one library's API. Swapping or upgrading PrimeNG means touching every consumer. Worse, each page ends up reimplementing its own loading states, error handling, and empty states around PrimeNG primitives. Wrapping PrimeNG in thin atoms and composing those into organisms centralises that logic. The wrapper cost is small; the consistency payoff compounds every sprint.

---

## After This, Read the Foundations (in order)

1. **[01-atomic-hierarchy](./01-atomic-hierarchy.md)** -- Component taxonomy and cascade rule
2. **[02-maturity-stages](./02-maturity-stages.md)** -- POC, Prototype, Production quality levels
3. **[03-project-structure](./03-project-structure.md)** -- Where files go, how they're named

Then pick your role-based path below.

## Reading Path by Role

**Developer (new to the project):**
00 -> 01 -> 02 -> 03 -> [11-implementation-tips](./11-implementation-tips.md) -> explore `src/`

**Developer (prototype work):**
All of the above, plus [05-token-pipeline](./05-token-pipeline.md) -> [07-qa-per-atomic-level](./07-qa-per-atomic-level.md) -> [10-derisking](./10-derisking.md) -> [production-plan-sketch](./production-plan-sketch.md) (for Wave 1 implementation status)

**BA / Product Owner:**
00 -> 01 -> 02 -> [08-pbi-and-ba-guide](./08-pbi-and-ba-guide.md) -> [acceptance-criteria](./acceptance-criteria.md)

**Designer:**
00 -> [13-designers-guide](./13-designers-guide.md) -> 01 -> [05-token-pipeline](./05-token-pipeline.md) -> [04-parallel-development](./04-parallel-development.md) -> [design-spec](./design-spec.md)

**Tech Lead:**
00 -> 01 -> 02 -> [06-tooling-landscape](./06-tooling-landscape.md) -> [simulation-report](./simulation-report.md)

**Evaluator (deciding whether to adopt):**
00 -> [simulation-report](./simulation-report.md) -> 02 -> [10-derisking](./10-derisking.md) -> [12-decision-guides](./12-decision-guides.md)

See [docs/README.md](./README.md) for the full documentation index.
