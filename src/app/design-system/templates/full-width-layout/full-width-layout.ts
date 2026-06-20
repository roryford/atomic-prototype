import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Template: Full-width centered column.
 *
 * A single padded column centered in the viewport. `maxWidth` controls how wide
 * the column is allowed to grow ('none' = fill available width, e.g. a list
 * page; a fixed value like '720px' = narrow reading column, e.g. a detail page).
 * An optional `title` renders a page heading above the projected content.
 *
 * Layout-only: `maxWidth` and `title` govern spatial arrangement, not domain
 * behavior. No data fetching, no business logic. See
 * docs/01-atomic-hierarchy.md § Level 4.
 */
@Component({
  selector: 'ds-full-width-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="full-width-layout" [style.max-width]="maxWidth()">
      @if (title()) {
        <h1 class="full-width-layout-title">{{ title() }}</h1>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .full-width-layout {
      width: 100%;
      margin: 0 auto;
      padding: 2rem;
      box-sizing: border-box;
      font-family: Inter, sans-serif;
    }

    .full-width-layout-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--p-text-color);
      margin: 0 0 24px 0;
    }
  `,
})
export class DsFullWidthLayout {
  /** Optional page heading rendered above the projected content. */
  title = input<string>();
  /** Max column width as a CSS value. 'none' fills the available width. */
  maxWidth = input('none');
}
