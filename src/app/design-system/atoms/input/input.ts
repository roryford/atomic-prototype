import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'ds-input',
  imports: [InputText, FormsModule],
  template: `
    <input pInputText [(ngModel)]="value" [placeholder]="placeholder()" />
  `,
})
export class DsInput {
  value = model<string>('');
  placeholder = input<string>('');
}
