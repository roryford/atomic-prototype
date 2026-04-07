import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

type ButtonSeverity =
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'help'
  | 'primary'
  | 'secondary'
  | 'contrast';

/**
 * Atom: Thin wrapper around PrimeNG p-button.
 *
 * Exposes only the inputs the design system uses (label, severity, outlined).
 * PrimeNG's full API (icon, size, loading, badge, etc.) is intentionally hidden —
 * add inputs only when the design system scope expands.
 *
 * Why wrap? Isolates consumers from PrimeNG API changes, enforces design constraints,
 * and makes it possible to swap the underlying library without touching every consumer.
 *
 * Output naming convention: generic actions on this atom use `clicked` because the
 * component has no domain context. Composed molecules and organisms should use
 * descriptive names (e.g. `actionClicked` on DsEmptyState, `retryClicked` on grids)
 * so that parent templates read clearly at a glance.
 */
@Component({
  selector: 'ds-button',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-button
      [label]="label()"
      [severity]="severity()"
      [outlined]="outlined()"
      (onClick)="clicked.emit()"
    />
  `,
})
export class DsButton {
  label = input<string>();
  severity = input<ButtonSeverity>('primary');
  outlined = input(false);
  clicked = output<void>();
}
