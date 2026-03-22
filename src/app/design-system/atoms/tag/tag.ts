import { Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'ds-tag',
  imports: [Tag],
  template: `
    <p-tag [value]="value()" [severity]="severity()" />
  `,
})
export class DsTag {
  value = input.required<string>();
  severity = input<TagSeverity>();
}
