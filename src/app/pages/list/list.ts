import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Avatar } from 'primeng/avatar';
import { DsButton, DsTag, DsInput } from '../../design-system/atoms';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

interface Project {
  id: number;
  name: string;
  owner: string;
  ownerInitials: string;
  status: string;
  statusSeverity: TagSeverity;
  createdDate: string;
}

@Component({
  selector: 'app-list',
  imports: [RouterLink, TableModule, Avatar, DsButton, DsTag, DsInput],
  template: `
    <div class="list-page">
      <div class="search-bar">
        <ds-input
          [(value)]="searchTerm"
          placeholder="Search projects..."
        />
        <ds-button
          label="Search"
          severity="primary"
          (clicked)="onSearch()"
        />
      </div>

      <p-table
        [value]="filteredProjects()"
        [tableStyle]="{ 'min-width': '60rem' }"
        styleClass="list-table"
        [rowHover]="true"
      >
        <ng-template #header>
          <tr>
            <th>ID</th>
            <th pSortableColumn="name">Name <p-sortIcon field="name" /></th>
            <th>Owner</th>
            <th>Status</th>
            <th pSortableColumn="createdDate">Created <p-sortIcon field="createdDate" /></th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template #body let-project>
          <tr>
            <td>{{ project.id }}</td>
            <td>
              <a [routerLink]="['/detail', project.id]" class="project-link">
                {{ project.name }}
              </a>
            </td>
            <td>
              <div class="owner-cell">
                <p-avatar
                  [label]="project.ownerInitials"
                  shape="circle"
                  size="normal"
                  styleClass="owner-avatar"
                />
                <span>{{ project.owner }}</span>
              </div>
            </td>
            <td>
              <ds-tag [value]="project.status" [severity]="project.statusSeverity" />
            </td>
            <td>{{ project.createdDate }}</td>
            <td>
              <ds-button
                label="View"
                severity="secondary"
                [outlined]="true"
                (clicked)="onView(project.id)"
              />
            </td>
          </tr>
        </ng-template>
        <ng-template #emptymessage>
          <tr>
            <td colspan="6" class="empty-message">No projects found.</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: `
    .list-page {
      width: 100%;
      padding: 2rem;
      box-sizing: border-box;
    }

    .search-bar {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      align-items: center;
    }

    .search-bar ds-input {
      flex: 1;
      max-width: 28rem;
    }

    :host ::ng-deep .list-table {
      border: 1px solid #E7E5E4;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    :host ::ng-deep .list-table .p-datatable-thead > tr > th {
      background: #F5F5F4;
      color: #1C1917;
      font-weight: 600;
      border-bottom: 1px solid #E7E5E4;
      padding: 0.75rem 1rem;
    }

    :host ::ng-deep .list-table .p-datatable-tbody > tr > td {
      color: #1C1917;
      border-bottom: 1px solid #E7E5E4;
      padding: 0.75rem 1rem;
    }

    :host ::ng-deep .list-table .p-datatable-tbody > tr:hover {
      background: #FAFAF9;
    }

    .project-link {
      color: #1C1917;
      text-decoration: none;
      font-weight: 500;
    }

    .project-link:hover {
      text-decoration: underline;
    }

    .owner-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    :host ::ng-deep .owner-avatar {
      background: #E7E5E4;
      color: #1C1917;
      font-size: 0.75rem;
      width: 2rem;
      height: 2rem;
    }

    .empty-message {
      text-align: center;
      padding: 2rem 1rem;
      color: #78716c;
    }
  `,
})
export class ListPage {
  searchTerm = signal('');

  private readonly projects = signal<Project[]>([
    { id: 1, name: 'Acme Redesign', owner: 'Rory Ford', ownerInitials: 'RF', status: 'Active', statusSeverity: 'success', createdDate: '2026-01-05' },
    { id: 2, name: 'Bolt Migration', owner: 'Sarah Chen', ownerInitials: 'SC', status: 'Active', statusSeverity: 'success', createdDate: '2026-01-12' },
    { id: 3, name: 'Cedar Analytics', owner: 'James Wu', ownerInitials: 'JW', status: 'Review', statusSeverity: 'info', createdDate: '2026-01-18' },
    { id: 4, name: 'Delta Platform', owner: 'Maria Lopez', ownerInitials: 'ML', status: 'On Hold', statusSeverity: 'warn', createdDate: '2026-01-22' },
    { id: 5, name: 'Echo Dashboard', owner: 'Rory Ford', ownerInitials: 'RF', status: 'Active', statusSeverity: 'success', createdDate: '2026-02-01' },
    { id: 6, name: 'Falcon API', owner: 'Priya Patel', ownerInitials: 'PP', status: 'Cancelled', statusSeverity: 'danger', createdDate: '2026-02-04' },
    { id: 7, name: 'Granite CMS', owner: 'Sarah Chen', ownerInitials: 'SC', status: 'Review', statusSeverity: 'info', createdDate: '2026-02-10' },
    { id: 8, name: 'Horizon Mobile', owner: 'Dev Nguyen', ownerInitials: 'DN', status: 'Active', statusSeverity: 'success', createdDate: '2026-02-15' },
    { id: 9, name: 'Iris Onboarding', owner: 'James Wu', ownerInitials: 'JW', status: 'On Hold', statusSeverity: 'warn', createdDate: '2026-02-19' },
    { id: 10, name: 'Jade Payments', owner: 'Maria Lopez', ownerInitials: 'ML', status: 'Active', statusSeverity: 'success', createdDate: '2026-02-25' },
    { id: 11, name: 'Kite Scheduler', owner: 'Rory Ford', ownerInitials: 'RF', status: 'Review', statusSeverity: 'info', createdDate: '2026-03-01' },
    { id: 12, name: 'Lunar Reporting', owner: 'Priya Patel', ownerInitials: 'PP', status: 'Active', statusSeverity: 'success', createdDate: '2026-03-04' },
    { id: 13, name: 'Mesa Auth', owner: 'Dev Nguyen', ownerInitials: 'DN', status: 'Cancelled', statusSeverity: 'danger', createdDate: '2026-03-07' },
    { id: 14, name: 'Nova Search', owner: 'Sarah Chen', ownerInitials: 'SC', status: 'Active', statusSeverity: 'success', createdDate: '2026-03-10' },
    { id: 15, name: 'Orbit Sync', owner: 'James Wu', ownerInitials: 'JW', status: 'On Hold', statusSeverity: 'warn', createdDate: '2026-03-12' },
    { id: 16, name: 'Pulse Monitor', owner: 'Maria Lopez', ownerInitials: 'ML', status: 'Review', statusSeverity: 'info', createdDate: '2026-03-14' },
    { id: 17, name: 'Quartz Billing', owner: 'Rory Ford', ownerInitials: 'RF', status: 'Active', statusSeverity: 'success', createdDate: '2026-03-16' },
    { id: 18, name: 'Ridge Infra', owner: 'Dev Nguyen', ownerInitials: 'DN', status: 'Active', statusSeverity: 'success', createdDate: '2026-03-18' },
  ]);

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.projects();
    return this.projects().filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.owner.toLowerCase().includes(term) ||
        p.status.toLowerCase().includes(term)
    );
  });

  onSearch(): void {
    // Filtering is reactive via the computed signal; this hook exists
    // for future enhancements (e.g. server-side search).
  }

  onView(id: number): void {
    // Navigation could also be handled here programmatically if needed.
  }
}
