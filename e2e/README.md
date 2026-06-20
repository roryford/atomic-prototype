# End-to-End Tests

Two styles of end-to-end test live here, both run by [Playwright](https://playwright.dev):

1. **Gherkin / BDD** — plain-English `.feature` files anyone can read or write,
   powered by [`playwright-bdd`](https://vitalets.github.io/playwright-bdd/).
2. **Plain Playwright** — code-only specs (`*.spec.ts`) for non-behavioral
   checks like screenshot capture.

The BDD style exists so non-technical testers and business analysts can author
test cases in English. It also doubles as living documentation of how the app
behaves, organized to mirror the [atomic design hierarchy](../docs/01-atomic-hierarchy.md).

## Layout

```
e2e/
  features/          ← Gherkin scenarios in plain English (BAs write these)
    navigation.feature
    dashboard.feature
    projects.feature
  steps/             ← the code each English phrase runs (developers write these)
    page.steps.ts        Level 5 — whole pages & navigation
    organism.steps.ts    Level 3 — sections within a page
    atom.steps.ts        Level 1 — individual buttons & headings
  STEP_CATALOG.md    ← the menu of phrases available to scenario authors
  *.spec.ts          ← plain Playwright specs (screenshots)
```

`.features-gen/` (git-ignored) holds the runnable tests that `playwright-bdd`
generates from the features — you never edit it by hand.

## Running

```bash
npm run e2e        # generate from features, then run the BDD behavioral suite
npm run e2e:bdd    # alias of the above (run only the Gherkin/BDD scenarios)
npm run e2e:ui     # interactive Playwright UI
npm run screenshots  # regenerate the doc screenshots in docs/screenshots/
```

Each `e2e` command runs `bddgen` first to turn `.feature` files into tests, then
starts the app (`ng serve`) automatically and runs against it.

`screenshots.spec.ts` is kept separate: it *captures* documentation images (it
overwrites files in `docs/screenshots/`), so it is **not** part of the default
`npm run e2e` run — regenerate those deliberately with `npm run screenshots`.

## Writing a scenario (no coding required)

1. Open or create a file in `e2e/features/` ending in `.feature`.
2. Compose your scenario from the phrases in [STEP_CATALOG.md](./STEP_CATALOG.md):

   ```gherkin
   Feature: Project dashboard

     Scenario: The dashboard summarises projects and stats
       Given I open the dashboard
       Then I should see the stat cards
       And I should see the project cards
   ```

3. Run `npm run e2e:bdd`.

**Tip:** install the [Cucumber (Gherkin) VS Code extension](https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official).
It autocompletes the available steps as you type and warns if you use a phrase
that has no matching step — turning the catalog into live suggestions.

## Adding a new step (developers)

If a scenario needs a phrase the catalog doesn't have, add it to the step file
for the appropriate atomic level using `createBdd()`:

```ts
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Then } = createBdd();

Then('I should see the project cards', async ({ page }) => {
  await expect(page.locator('.project-card').first()).toBeVisible();
});
```

Keep step phrasing **declarative** (describe intent, not clicks/selectors) so it
reads naturally and stays reusable. Then add the new phrase to
[STEP_CATALOG.md](./STEP_CATALOG.md).
