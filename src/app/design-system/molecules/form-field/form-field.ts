import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ds-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-field" [class.full-width]="fullWidth()">
      <label class="form-field-label" [for]="inputId()">{{ label() }}</label>
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
  /** Must match the `id` passed to the nested ds-input so the label is associated via for/id. */
  inputId = input.required<string>();
}
