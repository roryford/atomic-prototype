import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Template: Dashboard layout shell.
 *
 * Defines the spatial structure of a dashboard-style page — a full-height,
 * padded surface with a header bar (title + actions, laid out as a
 * space-between row) above a vertically stacked content region.
 *
 * Data-free scaffolding: elements tagged `header` are projected into the header
 * bar; everything else falls into the content region. The template never knows
 * what fills the slots, holds no business logic, and fetches no data — pages
 * project organisms into it. See docs/01-atomic-hierarchy.md § Level 4.
 */
@Component({
  selector: 'ds-dashboard-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-layout">
      <header class="dashboard-layout-header">
        <ng-content select="[header]" />
      </header>
      <div class="dashboard-layout-content">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .dashboard-layout {
      padding: 32px;
      background: var(--p-content-background);
      min-height: 100vh;
      box-sizing: border-box;
      font-family: Inter, sans-serif;
    }

    .dashboard-layout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
  `,
})
export class DsDashboardLayout {}
