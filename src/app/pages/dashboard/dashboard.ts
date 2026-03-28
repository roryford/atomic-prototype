import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { DsStatGrid } from '../../design-system/organisms/stat-grid/stat-grid';
import { DsProjectCardGrid } from '../../design-system/organisms/project-card-grid/project-card-grid';
import { DsButton } from '../../design-system/atoms/button/button';
import { Project } from '../../models';

@Component({
  selector: 'app-dashboard',
  imports: [DsStatGrid, DsProjectCardGrid, DsButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">Welcome back. Here's what's happening today.</p>
        </div>
        <ds-button
          label="Toggle Dark Mode"
          severity="secondary"
          [outlined]="true"
          (clicked)="toggleDarkMode()"
        />
      </header>

      <ds-stat-grid
        [stats]="projectService.stats.value() ?? []"
        [isLoading]="projectService.stats.isLoading()"
        [error]="projectService.stats.error()?.message ?? null"
        (retryClicked)="projectService.stats.reload()"
      />

      <section class="section">
        <h2 class="section-title">Active Projects</h2>
        <ds-project-card-grid
          [projects]="projectService.projects.value() ?? []"
          [isLoading]="projectService.projects.isLoading()"
          [error]="projectService.projects.error()?.message ?? null"
          (projectSelected)="onProjectSelected($event)"
          (retryClicked)="projectService.projects.reload()"
        />
      </section>
    </div>
  `,
  styles: `
    .dashboard {
      padding: 32px;
      background: var(--p-content-background);
      min-height: 100vh;
      font-family: Inter, sans-serif;
    }

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
      color: var(--p-text-color);
      margin: 0 0 4px 0;
    }

    .dashboard-subtitle {
      font-size: 14px;
      color: var(--p-text-muted-color);
      margin: 0;
    }

    .section {
      margin-top: 40px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--p-text-color);
      margin: 0 0 20px 0;
    }
  `,
})
export class Dashboard {
  projectService = inject(ProjectService);
  private router = inject(Router);

  onProjectSelected(project: Project) {
    this.router.navigate(['/detail', project.id]);
  }

  toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
