import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from 'primeng/message';

type MessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

/**
 * Atom: Thin wrapper around PrimeNG p-message.
 *
 * Exposes only the inputs the design system uses for inline status messages
 * (severity, text). Pages render feedback via `ds-message` rather than
 * importing PrimeNG directly.
 */
@Component({
  selector: 'ds-message',
  imports: [Message],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <p-message [severity]="severity()" [text]="text()" /> `,
})
export class DsMessage {
  severity = input<MessageSeverity>('info');
  text = input<string>();
}
