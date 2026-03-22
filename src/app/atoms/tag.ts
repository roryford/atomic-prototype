import { Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-tag',
  imports: [Tag],
  template: `
    <p-tag [value]="value()" [severity]="severity()" />
  `,
})
export class AppTag {
  value = input.required<string>();
  severity = input<TagSeverity>();
}
