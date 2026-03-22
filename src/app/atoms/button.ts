import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

type ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast';

@Component({
  selector: 'app-button',
  imports: [Button],
  template: `
    <p-button
      [label]="label()"
      [severity]="severity()"
      [outlined]="outlined()"
      (onClick)="clicked.emit()"
    />
  `,
})
export class AppButton {
  label = input<string>();
  severity = input<ButtonSeverity>('primary');
  outlined = input(false);
  clicked = output<void>();
}
