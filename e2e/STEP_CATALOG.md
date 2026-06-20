# Step Catalog

This is the menu of plain-English phrases you can use to write a test scenario.
A test is just a list of these phrases. You don't need to write code — you
combine existing steps. If you need a phrase that isn't here, ask a developer to
add it (see [README](./README.md)).

Each step starts with one of three keywords:

- **Given** — a starting situation ("Given I open the dashboard")
- **When** — an action you take ("When I click the first project card")
- **Then** — the result you expect ("Then I should see the stat cards")

Use **And** to add another line of the same kind:

```gherkin
Then I should see the stat cards
And I should see the project cards
```

Anything in `"quotes"` is a value you fill in.

---

## Page steps — whole screens & navigation (Atomic Design: Level 5)

| Step                                        | What it does                                                 |
| ------------------------------------------- | ------------------------------------------------------------ |
| `Given I open the app`                      | Opens the app at its home address                            |
| `Given I open the dashboard`                | Goes straight to the Dashboard screen                        |
| `Given I open the projects list`            | Goes straight to the List screen                             |
| `When I open an unknown route`              | Visits an address that doesn't exist                         |
| `When I open project "..."`                 | Opens a single project by its number, e.g. `"1"`             |
| `When I click the "..." navigation link`    | Clicks a link in the top nav, e.g. `"List"` or `"Dashboard"` |
| `Then I should be on the "..." page`        | Checks the current screen — `"Dashboard"` or `"List"`        |
| `Then I should be on a project detail page` | Checks you've landed on a single project's page              |

## Organism steps — sections within a page (Atomic Design: Level 3)

| Step                                                            | What it does                                      |
| --------------------------------------------------------------- | ------------------------------------------------- |
| `Then I should see the stat cards`                              | Checks the row of summary KPI cards is shown      |
| `Then I should see the project cards`                           | Checks the grid of project cards is shown         |
| `When I click the first project card`                           | Opens the first project in the grid               |
| `Then I should see the project table with at least one project` | Checks the projects table has at least one row    |
| `Then I should see an error message`                            | Checks an error message is shown (e.g. not found) |

## Atom steps — individual buttons & headings (Atomic Design: Level 1)

| Step                                        | What it does                                           |
| ------------------------------------------- | ------------------------------------------------------ |
| `When I click the "..." button`             | Clicks a button by its label, e.g. `"Back to List"`    |
| `Then I should see the project named "..."` | Checks the open project's name, e.g. `"Acme Redesign"` |

---

## Example: a complete scenario

```gherkin
Feature: Project dashboard

  Scenario: Opening a project from its card
    Given I open the dashboard
    When I click the first project card
    Then I should be on a project detail page
```

Every line above is a step from the tables on this page. That's all a scenario
is. See [`features/dashboard.feature`](./features/dashboard.feature) and
[`features/navigation.feature`](./features/navigation.feature) for the live
examples this catalog is built from.
