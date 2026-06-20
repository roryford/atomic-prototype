import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { Divider } from 'primeng/divider';
import { ProjectService } from '../../services/project.service';
import { DsButton } from '../../design-system/atoms/button/button';
import { DsProjectDetailCard } from '../../design-system/organisms/project-detail-card/project-detail-card';
import { DsFullWidthLayout } from '../../design-system/templates/full-width-layout/full-width-layout';

@Component({
  selector: 'app-detail',
  imports: [Skeleton, Message, Divider, DsButton, DsProjectDetailCard, DsFullWidthLayout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ds-full-width-layout [maxWidth]="'720px'">
      @if (project.isLoading()) {
        <div class="detail-card">
          <div class="skeleton-header">
            <p-skeleton shape="circle" size="4rem" />
            <div class="skeleton-title">
              <p-skeleton width="200px" height="28px" />
              <p-skeleton width="80px" height="24px" />
            </div>
          </div>
          <p-divider />
          <div class="info-section">
            @for (_ of [1, 2, 3, 4]; track $index) {
              <div class="field">
                <p-skeleton width="80px" height="14px" />
                <p-skeleton width="100%" height="38px" />
              </div>
            }
            <div class="field full-width">
              <p-skeleton width="80px" height="14px" />
              <p-skeleton width="100%" height="38px" />
            </div>
          </div>
        </div>
      } @else if (project.error()) {
        <div class="detail-card error-card">
          <p-message severity="error" text="Project not found" />
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
    .detail-card {
      background: var(--p-content-background);
      border: 1px solid var(--p-content-border-color);
      border-radius: 12px;
      padding: 2rem;
    }

    .error-card {
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

    .skeleton-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .skeleton-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .info-section .full-width {
      grid-column: 1 / -1;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .field.full-width {
      grid-column: 1 / -1;
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
