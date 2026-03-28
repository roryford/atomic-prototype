import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DsButton } from '../button/button';

@Component({
  selector: 'ds-empty-state',
  imports: [DsButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state">
      <i class="pi {{ icon() }} empty-icon"></i>
      <p class="empty-message">{{ message() }}</p>
      @if (actionLabel()) {
        <ds-button
          [label]="actionLabel()!"
          severity="primary"
          (clicked)="actionClicked.emit()"
        />
      }
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
    }

    .empty-icon {
      font-size: 48px;
      color: var(--p-text-muted-color);
    }

    .empty-message {
      font-size: 16px;
      color: var(--p-text-muted-color);
      margin: 8px 0 0 0;
      text-align: center;
    }

    ds-button {
      margin-top: 16px;
    }
  `,
})
export class DsEmptyState {
  icon = input('pi-inbox');
  message = input.required<string>();
  actionLabel = input<string>();
  actionClicked = output<void>();
}
