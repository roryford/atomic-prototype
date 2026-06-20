Feature: Browsing projects
  As a team member
  I want to view the project list and open individual projects
  So that I can review the details of any project

  Scenario: The list page shows projects in a table
    Given I open the projects list
    Then I should see the project table with at least one project

  Scenario: Viewing a project's details
    When I open project "1"
    Then I should see the project named "Acme Redesign"

  Scenario: Opening a project that doesn't exist
    When I open project "999"
    Then I should see an error message

  Scenario: Returning to the list from an open project
    When I open project "1"
    And I click the "Back to List" button
    Then I should be on the "List" page

  Scenario: Returning to the list from a missing project
    When I open project "999"
    And I click the "Back to List" button
    Then I should be on the "List" page
