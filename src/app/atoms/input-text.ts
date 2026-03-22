import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-input-text',
  imports: [InputText, FormsModule],
  template: `
    <input pInputText [(ngModel)]="value" [placeholder]="placeholder()" />
  `,
})
export class AppInputText {
  value = model<string>('');
  placeholder = input<string>('');
}
