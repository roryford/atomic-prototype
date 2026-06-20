import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { DsProjectTable } from '../../design-system/organisms/project-table/project-table';
import { DsFullWidthLayout } from '../../design-system/templates/full-width-layout/full-width-layout';
import { Project } from '../../models';

@Component({
  selector: 'app-list',
  imports: [DsProjectTable, DsFullWidthLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ds-full-width-layout title="Projects">
      <ds-project-table
        [projects]="projectService.projects.value() ?? []"
        [isLoading]="projectService.projects.isLoading()"
        [error]="projectService.projects.error()?.message ?? null"
        (projectSelected)="onProjectSelected($event)"
        (retryClicked)="projectService.projects.reload()"
      />
    </ds-full-width-layout>
  `,
})
export class ListPage {
  projectService = inject(ProjectService);
  private router = inject(Router);

  onProjectSelected(project: Project) {
    this.router.navigate(['/detail', project.id]);
  }
}
