import { Component, computed, input, output, signal } from '@angular/core';
import { Project } from '../../../models';
import { DsEmptyState } from '../../atoms/empty-state/empty-state';
import { DsButton } from '../../atoms/button/button';
import { DsTag } from '../../atoms/tag/tag';
import { DsSearchBar } from '../../molecules/search-bar/search-bar';
import { Skeleton } from 'primeng/skeleton';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'ds-project-table',
  imports: [DsEmptyState, DsButton, DsTag, DsSearchBar, Skeleton, Message, TableModule, Avatar],
  templateUrl: './project-table.html',
  styleUrl: './project-table.scss',
})
export class DsProjectTable {
  projects = input<Project[]>([]);
  isLoading = input(false);
  error = input<string | null>(null);
  projectSelected = output<Project>();
  retryClicked = output<void>();

  searchTerm = signal('');

  filteredProjects = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.projects();
    return this.projects().filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.owner.toLowerCase().includes(term) ||
        p.status.toLowerCase().includes(term),
    );
  });

  onSearch(term: string): void {
    this.searchTerm.set(term);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }
}
