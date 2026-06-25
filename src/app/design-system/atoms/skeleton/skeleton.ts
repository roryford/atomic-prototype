import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

type SkeletonShape = 'rectangle' | 'circle';

/**
 * Atom: Thin wrapper around PrimeNG p-skeleton.
 *
 * Exposes only the inputs the design system uses for loading placeholders
 * (shape, size, width, height). When `size` is set it takes precedence over
 * width/height (PrimeNG behaviour), which is how the circular avatar
 * placeholder is rendered.
 *
 * Why wrap? Pages and organisms compose loading states from `ds-skeleton`
 * rather than reaching into PrimeNG directly — see DsProjectDetailCardSkeleton.
 */
@Component({
  selector: 'ds-skeleton',
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-skeleton [shape]="shape()" [size]="size()" [width]="width()" [height]="height()" />
  `,
})
export class DsSkeleton {
  shape = input<SkeletonShape>('rectangle');
  /** When set, overrides width/height (used for square/circle placeholders). */
  size = input<string>();
  width = input('100%');
  height = input('1rem');
}
