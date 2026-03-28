import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { DsProjectTable } from '../../design-system/organisms/project-table/project-table';
import { Project } from '../../models';

@Component({
  selector: 'app-list',
  imports: [DsProjectTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="list-page">
      <h1 class="list-title">Projects</h1>
      <ds-project-table
        [projects]="projectService.projects.value() ?? []"
        [isLoading]="projectService.projects.isLoading()"
        [error]="projectService.projects.error()?.message ?? null"
        (projectSelected)="onProjectSelected($event)"
        (retryClicked)="projectService.projects.reload()"
      />
    </div>
  `,
  styles: `
    .list-page {
      width: 100%;
      padding: 2rem;
      box-sizing: border-box;
    }

    .list-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--p-text-color);
      margin: 0 0 24px 0;
    }
  `,
})
export class ListPage {
  projectService = inject(ProjectService);
  private router = inject(Router);

  onProjectSelected(project: Project) {
    this.router.navigate(['/detail', project.id]);
  }
}
