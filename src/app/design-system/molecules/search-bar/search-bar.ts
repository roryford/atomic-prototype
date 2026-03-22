import { Component, input, model, output } from '@angular/core';
import { DsInput, DsButton } from '../../atoms';

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
