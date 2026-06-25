import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DsSkeleton } from '../../atoms/skeleton/skeleton';
import { DsDivider } from '../../atoms/divider/divider';

/**
 * Organism: Loading placeholder for DsProjectDetailCard.
 *
 * Mirrors the detail card's layout (avatar + title, divider, info grid) so a
 * page can swap a single component for its loading state instead of composing
 * skeleton primitives inline. Purely presentational — no inputs, no logic.
 */
@Component({
  selector: 'ds-project-detail-card-skeleton',
  imports: [DsSkeleton, DsDivider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-detail-card-skeleton.html',
  styleUrl: './project-detail-card-skeleton.scss',
})
export class DsProjectDetailCardSkeleton {
  /** Placeholder fields rendered in the info grid (matches the real card). */
  protected readonly placeholders = [1, 2, 3, 4];
}
