import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Divider } from 'primeng/divider';
import { DsButton, DsTag, DsInput } from '../../design-system/atoms';

@Component({
  selector: 'app-detail',
  imports: [Avatar, Divider, DsButton, DsTag, DsInput],
  template: `
    <div class="detail-page">
      <div class="detail-card">

        <!-- Entity Header -->
        <div class="entity-header">
          <p-avatar label="PA" size="xlarge" shape="circle" />
          <div class="entity-title">
            <h1>Project Alpha</h1>
            <ds-tag value="Active" severity="success" />
          </div>
        </div>

        <p-divider />

        <!-- Info Section -->
        <div class="info-section">
          <div class="field">
            <label>Project Name</label>
            <ds-input [value]="'Project Alpha'" placeholder="Project Name" />
          </div>
          <div class="field">
            <label>Owner</label>
            <ds-input [value]="'Sarah Chen'" placeholder="Owner" />
          </div>
          <div class="field">
            <label>Created</label>
            <ds-input [value]="'January 15, 2026'" placeholder="Created" />
          </div>
          <div class="field">
            <label>Category</label>
            <ds-input [value]="'Engineering'" placeholder="Category" />
          </div>
          <div class="field full-width">
            <label>Description</label>
            <ds-input
              [value]="'Core platform redesign and API modernization initiative'"
              placeholder="Description"
            />
          </div>
        </div>

        <p-divider />

        <!-- Action Buttons -->
        <div class="action-buttons">
          <ds-button label="Edit" severity="primary" />
          <ds-button label="Delete" severity="danger" />
          <ds-button label="Back to List" severity="secondary" [outlined]="true" (clicked)="goBack()" />
        </div>

      </div>
    </div>
  `,
  styles: `
    .detail-page {
      max-width: 720px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .detail-card {
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 2rem;
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
      color: #1C1917;
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

    .field label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #78716C;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }
  `,
})
export class Detail {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/list']);
  }
}
