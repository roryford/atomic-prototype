import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

/**
 * Atom: Thin wrapper around PrimeNG InputText.
 *
 * Uses model() instead of input() for the value because the user types into
 * the field — both parent and child need to read and write the same value.
 * This enables two-way binding: [(value)]="searchTerm".
 */
@Component({
  selector: 'ds-input',
  imports: [InputText, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <input pInputText [(ngModel)]="value" [placeholder]="placeholder()" /> `,
})
export class DsInput {
  value = model<string>('');
  placeholder = input<string>('');
}
