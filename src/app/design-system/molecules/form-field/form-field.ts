import { Component, input } from '@angular/core';

@Component({
  selector: 'ds-form-field',
  template: `
    <div class="form-field" [class.full-width]="fullWidth()">
      <label class="form-field-label">{{ label() }}</label>
      <ng-content />
    </div>
  `,
  styles: `
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-field.full-width {
      width: 100%;
    }

    .form-field-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--p-text-muted-color);
    }
  `,
})
export class DsFormField {
  label = input.required<string>();
  fullWidth = input(false);
}
