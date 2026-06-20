Feature: Project dashboard
  As a team member
  I want to see my projects at a glance
  So that I know what needs my attention

  Background:
    Given I open the dashboard

  Scenario: The dashboard summarises projects and stats
    Then I should see the stat cards
    And I should see the project cards

  Scenario: Opening a project from its card
    When I click the first project card
    Then I should be on a project detail page
