import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { DsButton } from '../../design-system/atoms/button/button';
import { DsMessage } from '../../design-system/atoms/message/message';
import { DsProjectDetailCard } from '../../design-system/organisms/project-detail-card/project-detail-card';
import { DsProjectDetailCardSkeleton } from '../../design-system/organisms/project-detail-card-skeleton/project-detail-card-skeleton';
import { DsFullWidthLayout } from '../../design-system/templates/full-width-layout/full-width-layout';

@Component({
  selector: 'app-detail',
  imports: [
    DsButton,
    DsMessage,
    DsProjectDetailCard,
    DsProjectDetailCardSkeleton,
    DsFullWidthLayout,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ds-full-width-layout [maxWidth]="'720px'">
      @if (project.isLoading()) {
        <ds-project-detail-card-skeleton />
      } @else if (project.error()) {
        <div class="error-card">
          <ds-message severity="error" text="Project not found" />
          <p class="error-detail">
            The project you're looking for doesn't exist or couldn't be loaded.
          </p>
          <ds-button
            label="Back to List"
            severity="secondary"
            [outlined]="true"
            (clicked)="goBack()"
          />
        </div>
      } @else if (project.value(); as p) {
        <ds-project-detail-card [project]="p" (backClicked)="goBack()" />
      }
    </ds-full-width-layout>
  `,
  styles: `
    .error-card {
      background: var(--p-content-background);
      border: 1px solid var(--p-content-border-color);
      border-radius: 12px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .error-detail {
      color: var(--p-text-muted-color);
      margin: 0;
    }
  `,
})
export class Detail {
  private router = inject(Router);
  private projectService = inject(ProjectService);

  /** Bound to the `:id` route param via withComponentInputBinding(). */
  id = input.required<string>();

  private numericId = computed(() => Number(this.id()));

  project = this.projectService.projectById(this.numericId);

  goBack() {
    this.router.navigate(['/list']);
  }
}
