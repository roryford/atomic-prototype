import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Divider } from 'primeng/divider';

type DividerLayout = 'horizontal' | 'vertical';
type DividerType = 'solid' | 'dashed' | 'dotted';
type DividerAlign = 'left' | 'center' | 'right' | 'top' | 'bottom';

/**
 * Atom: Thin wrapper around PrimeNG p-divider.
 *
 * Exposes only the inputs the design system uses (layout, type, align).
 * Organisms and pages compose section separators from `ds-divider` rather
 * than importing PrimeNG directly.
 */
@Component({
  selector: 'ds-divider',
  imports: [Divider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <p-divider [layout]="layout()" [type]="type()" [align]="align()" /> `,
})
export class DsDivider {
  layout = input<DividerLayout>('horizontal');
  type = input<DividerType>('solid');
  align = input<DividerAlign>();
}
