import { Component, input, model, output } from '@angular/core';
import { DsInput, DsButton } from '../../atoms';

/**
 * Molecule: Composes DsInput + DsButton with local interaction logic.
 *
 * model() on value enables two-way binding with parent.
 * output() on searched emits the current value when the user clicks Search
 * or presses Enter — the parent decides what to do with the search term.
 * The (keydown.enter) handler on the wrapper enables keyboard submission.
 */
@Component({
  selector: 'ds-search-bar',
  imports: [DsInput, DsButton],
  template: `
    <div class="search-bar" (keydown.enter)="searched.emit(value())">
      <ds-input
        [(value)]="value"
        [placeholder]="placeholder()"
      />
      <ds-button
        label="Search"
        severity="primary"
        (clicked)="searched.emit(value())"
      />
    </div>
  `,
  styles: `
    .search-bar {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    ds-input {
      flex: 1;
    }
  `,
})
export class DsSearchBar {
  value = model('');
  placeholder = input('Search...');
  searched = output<string>();
}
