import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DsStatCard } from '../../design-system/molecules';
import { DsButton, DsTag, DsInput } from '../../design-system/atoms';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';
import { TableModule } from 'primeng/table';

interface ActivityRow {
  name: string;
  status: string;
  statusSeverity: 'success' | 'info' | 'warn' | 'danger';
  date: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [DsStatCard, DsButton, DsInput, DsTag, Card, Avatar, TableModule, FormsModule],
  template: `
    <div class="dashboard">
      <!-- Page Header -->
      <header class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">Welcome back. Here's what's happening today.</p>
        </div>
        <ds-button label="Export Report" severity="primary" [outlined]="true" />
      </header>

      <!-- Stat Cards Row -->
      <section class="stat-grid">
        @for (stat of stats(); track stat.label) {
          <ds-stat-card [label]="stat.label" [value]="stat.value" [icon]="stat.icon" />
        }
      </section>

      <!-- Project Cards Row -->
      <section class="section">
        <h2 class="section-title">Active Projects</h2>
        <div class="card-grid">
          @for (project of projects(); track project.name) {
            <p-card>
              <div class="project-card-body">
                <div class="project-header">
                  <p-avatar
                    [label]="project.avatar"
                    shape="circle"
                    [style]="{ 'background-color': project.color, color: '#ffffff' }"
                  />
                  <ds-tag [value]="project.status" [severity]="project.severity" />
                </div>
                <h3 class="project-name">{{ project.name }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-meta">
                  <span class="meta-item"><i class="pi pi-users"></i> {{ project.members }} members</span>
                  <span class="meta-item"><i class="pi pi-calendar"></i> {{ project.deadline }}</span>
                </div>
              </div>
            </p-card>
          }
        </div>
      </section>

      <!-- Data Table -->
      <section class="section">
        <h2 class="section-title">Recent Activity</h2>
        <div class="table-container">
          <p-table
            [value]="activities()"
            [rows]="10"
            [tableStyle]="{ 'min-width': '40rem' }"
            [pt]="{ thead: { style: 'text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em' } }"
          >
            <ng-template pTemplate="header">
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-row>
              <tr>
                <td class="name-cell">{{ row.name }}</td>
                <td>
                  <ds-tag [value]="row.status" [severity]="row.statusSeverity" />
                </td>
                <td class="date-cell">{{ row.date }}</td>
                <td>
                  <ds-button label="View" severity="secondary" [outlined]="true" />
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </section>

      <!-- Dark Mode Test (Spike 3) -->
      <section class="section">
        <h2 class="section-title">Dark Mode Test</h2>
        <ds-button
          label="Toggle Dark Mode"
          severity="secondary"
          [outlined]="true"
          (clicked)="toggleDarkMode()"
        />
        <div class="dark-mode-demo">
          <p-card>
            <div class="dark-mode-form">
              <label class="form-label">Nested Composition Test</label>
              <ds-input placeholder="Type something..." [(value)]="demoInput" />
              <div class="form-actions">
                <ds-button label="Submit" severity="primary" />
                <ds-button label="Cancel" severity="secondary" [outlined]="true" />
                <ds-button label="Delete" severity="danger" />
              </div>
              <div class="tag-row">
                <ds-tag value="Success" severity="success" />
                <ds-tag value="Warning" severity="warn" />
                <ds-tag value="Error" severity="danger" />
                <ds-tag value="Info" severity="info" />
              </div>
            </div>
          </p-card>
        </div>
      </section>
    </div>
  `,
  styles: `
    .dashboard {
      padding: 32px;
      background: #FAFAF9;
      min-height: 100vh;
      font-family: Inter, sans-serif;
    }

    /* Header */
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .dashboard-title {
      font-size: 28px;
      font-weight: 700;
      color: #1C1917;
      margin: 0 0 4px 0;
    }

    .dashboard-subtitle {
      font-size: 14px;
      color: #78716C;
      margin: 0;
    }

    /* Stat Cards — responsive grid */
    .stat-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 40px;
    }

    @media (min-width: 640px) {
      .stat-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .stat-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1440px) {
      .stat-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    /* Sections */
    .section {
      margin-bottom: 40px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1C1917;
      margin: 0 0 20px 0;
    }

    /* Project Card Grid — same responsive breakpoints */
    .card-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    @media (min-width: 640px) {
      .card-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .card-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Project card inner layout */
    .project-card-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .project-name {
      font-size: 16px;
      font-weight: 600;
      color: #1C1917;
      margin: 0;
    }

    .project-description {
      font-size: 13px;
      color: #78716C;
      margin: 0;
      line-height: 1.5;
    }

    .project-meta {
      display: flex;
      gap: 16px;
      padding-top: 8px;
      border-top: 1px solid #E7E5E4;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #78716C;
    }

    .meta-item .pi {
      font-size: 12px;
    }

    /* Table container */
    .table-container {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      overflow: hidden;
    }

    .name-cell {
      font-weight: 500;
      color: #1C1917;
    }

    .date-cell {
      color: #78716C;
      font-size: 13px;
    }

    /* Dark Mode Demo */
    .dark-mode-demo {
      margin-top: 16px;
    }

    .dark-mode-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--p-text-color);
    }

    .form-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  `,
})
export class Dashboard {
  stats = signal([
    { label: 'Total Users', value: '12,847', icon: 'pi-users' },
    { label: 'Active Projects', value: '284', icon: 'pi-briefcase' },
    { label: 'Open Tasks', value: '1,429', icon: 'pi-check-square' },
    { label: 'Revenue', value: '$847K', icon: 'pi-dollar' },
  ]);

  projects = signal([
    {
      name: 'Project Alpha',
      description: 'Next-gen platform rebuild with new component architecture and CI/CD pipeline.',
      status: 'On Track',
      severity: 'success' as const,
      avatar: 'A',
      color: '#4338CA',
      members: 8,
      deadline: 'Apr 15',
    },
    {
      name: 'Design System',
      description: 'Unified token library and component catalog across web and mobile products.',
      status: 'In Review',
      severity: 'info' as const,
      avatar: 'D',
      color: '#0891B2',
      members: 5,
      deadline: 'Mar 30',
    },
    {
      name: 'API Migration',
      description: 'REST-to-GraphQL migration for core services with backward compatibility layer.',
      status: 'At Risk',
      severity: 'warn' as const,
      avatar: 'M',
      color: '#D97706',
      members: 6,
      deadline: 'May 01',
    },
  ]);

  demoInput = signal('');

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark-mode');
  }

  activities = signal<ActivityRow[]>([
    { name: 'Homepage Redesign', status: 'Completed', statusSeverity: 'success', date: 'Mar 22, 2026' },
    { name: 'User Auth Flow', status: 'In Progress', statusSeverity: 'info', date: 'Mar 21, 2026' },
    { name: 'Payment Integration', status: 'At Risk', statusSeverity: 'warn', date: 'Mar 20, 2026' },
    { name: 'Mobile Responsive', status: 'Completed', statusSeverity: 'success', date: 'Mar 19, 2026' },
    { name: 'Search Indexing', status: 'In Progress', statusSeverity: 'info', date: 'Mar 18, 2026' },
    { name: 'Data Export Feature', status: 'Blocked', statusSeverity: 'danger', date: 'Mar 17, 2026' },
    { name: 'Notification System', status: 'In Progress', statusSeverity: 'info', date: 'Mar 16, 2026' },
    { name: 'Performance Audit', status: 'Completed', statusSeverity: 'success', date: 'Mar 15, 2026' },
  ]);
}
