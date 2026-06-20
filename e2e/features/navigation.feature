Feature: Navigation
  As a team member
  I want to move between the main screens
  So that I can find the information I need

  Scenario: Landing on the app shows the dashboard
    Given I open the app
    Then I should be on the "Dashboard" page

  Scenario: Going to the projects list
    Given I open the dashboard
    When I click the "List" navigation link
    Then I should be on the "List" page

  Scenario: Returning to the dashboard
    Given I open the projects list
    When I click the "Dashboard" navigation link
    Then I should be on the "Dashboard" page

  Scenario: An unknown address falls back to the dashboard
    When I open an unknown route
    Then I should be on the "Dashboard" page
