import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DashboardStats } from '../../../models';
import { DsStatCard } from '../../molecules/stat-card/stat-card';
import { DsEmptyState } from '../../atoms/empty-state/empty-state';
import { DsButton } from '../../atoms/button/button';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';

@Component({
  selector: 'ds-stat-grid',
  imports: [DsStatCard, DsEmptyState, DsButton, Skeleton, Message],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-grid.html',
  styleUrl: './stat-grid.scss',
})
export class DsStatGrid {
  stats = input<DashboardStats[]>([]);
  isLoading = input(false);
  error = input<string | null>(null);
  retryClicked = output<void>();
}
