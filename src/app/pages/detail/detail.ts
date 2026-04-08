import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { ProjectService } from '../../services/project.service';
import { DsFormField } from '../../design-system/molecules/form-field/form-field';
import { DsButton } from '../../design-system/atoms/button/button';
import { DsTag } from '../../design-system/atoms/tag/tag';
import { DsInput } from '../../design-system/atoms/input/input';

@Component({
  selector: 'app-detail',
  imports: [Avatar, Divider, Skeleton, Message, DsFormField, DsButton, DsTag, DsInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detail-page">
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
        <div class="detail-card">
          <div class="entity-header">
            <p-avatar
              [label]="p.ownerInitials"
              size="xlarge"
              shape="circle"
              [style]="{ 'background-color': p.color, color: 'var(--p-surface-0)' }"
            />
            <div class="entity-title">
              <h1>{{ p.name }}</h1>
              <ds-tag [value]="p.status" [severity]="p.statusSeverity" />
            </div>
          </div>

          <p-divider />

          <div class="info-section">
            <ds-form-field label="Project Name" inputId="field-name">
              <ds-input [value]="p.name" placeholder="Project Name" id="field-name" />
            </ds-form-field>
            <ds-form-field label="Owner" inputId="field-owner">
              <ds-input [value]="p.owner" placeholder="Owner" id="field-owner" />
            </ds-form-field>
            <ds-form-field label="Created" inputId="field-created">
              <ds-input [value]="p.createdDate" placeholder="Created" id="field-created" />
            </ds-form-field>
            <ds-form-field label="Category" inputId="field-category">
              <ds-input [value]="p.category" placeholder="Category" id="field-category" />
            </ds-form-field>
            <div class="full-width">
              <ds-form-field label="Description" [fullWidth]="true" inputId="field-description">
                <ds-input
                  [value]="p.description"
                  placeholder="Description"
                  id="field-description"
                />
              </ds-form-field>
            </div>
          </div>

          <p-divider />

          <div class="action-buttons">
            <ds-button label="Edit" severity="primary" />
            <ds-button label="Delete" severity="danger" />
            <ds-button
              label="Back to List"
              severity="secondary"
              [outlined]="true"
              (clicked)="goBack()"
            />
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .detail-page {
      max-width: 720px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

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

    .entity-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .entity-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .entity-title h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--p-text-color);
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

    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }
  `,
})
export class Detail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);

  project = this.projectService.projectById(Number(this.route.snapshot.paramMap.get('id')));

  goBack() {
    this.router.navigate(['/list']);
  }
}
