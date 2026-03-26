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

/**
 * Organism: Data-aware project table with search, filtering, and 5-state rendering.
 *
 * States: loading → error → empty → search-no-results → data
 * (rendered in @if priority order in the template)
 *
 * Uses signal() for searchTerm (local state the parent doesn't need to see)
 * and computed() for filteredProjects (derived state that auto-updates when
 * projects or searchTerm change — no manual state management needed).
 *
 * Does not fetch data — receives it via inputs. The parent (page) owns the
 * data lifecycle; this organism owns the presentation and filtering.
 */
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
