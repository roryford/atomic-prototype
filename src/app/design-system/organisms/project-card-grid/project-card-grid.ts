import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Project } from '../../../models';
import { DsEmptyState } from '../../atoms/empty-state/empty-state';
import { DsButton } from '../../atoms/button/button';
import { DsTag } from '../../atoms/tag/tag';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'ds-project-card-grid',
  imports: [DsEmptyState, DsButton, DsTag, Skeleton, Message, Card, Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-card-grid.html',
  styleUrl: './project-card-grid.scss',
})
export class DsProjectCardGrid {
  projects = input<Project[]>([]);
  isLoading = input(false);
  error = input<string | null>(null);
  projectSelected = output<Project>();
  retryClicked = output<void>();

  onCardKeydown(event: KeyboardEvent, project: Project): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.projectSelected.emit(project);
    }
  }
}
