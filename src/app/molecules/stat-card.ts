import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div class="stat-card">
      <div class="stat-icon">
        <i class="pi" [class]="icon()"></i>
      </div>
      <div class="stat-content">
        <span class="stat-value">{{ value() }}</span>
        <span class="stat-label">{{ label() }}</span>
      </div>
    </div>
  `,
  styles: `
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: #FFFFFF;
      border: 1px solid #E7E5E4;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      .pi {
        font-size: 32px;
        color: #4338CA;
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: Inter, sans-serif;
      font-size: 24px;
      font-weight: 700;
      line-height: 32px;
      color: #1C1917;
    }

    .stat-label {
      font-family: Inter, sans-serif;
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      color: #78716C;
    }
  `,
})
export class StatCard {
  label = input.required<string>();
  value = input.required<string>();
  icon = input<string>('pi-chart-bar');
}
