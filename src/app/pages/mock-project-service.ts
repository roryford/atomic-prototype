import { signal } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project, DashboardStats } from '../models';

/**
 * Test/story doubles for {@link ProjectService}.
 *
 * The real service exposes signal-based `httpResource` refs that pages read via
 * `.value()`, `.isLoading()`, `.error()` and `.reload()`. These helpers fake
 * that shape so Storybook (and unit tests) can drive every render state without
 * a live backend. Pages only touch those four members, so the cast to
 * `ProjectService` is safe.
 */
export interface FakeResourceState<T> {
  value?: T;
  isLoading?: boolean;
  /** Error message; wrapped as `{ message }` to mirror the real Error shape. */
  error?: string;
}

function fakeResource<T>(state: FakeResourceState<T>) {
  return {
    value: signal<T | undefined>(state.value),
    isLoading: signal(state.isLoading ?? false),
    error: signal<{ message: string } | undefined>(
      state.error ? { message: state.error } : undefined,
    ),
    reload: () => true,
  };
}

export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'A next-generation platform for data analytics and visualization.',
    owner: 'Sarah Chen',
    ownerInitials: 'SC',
    status: 'Active',
    statusSeverity: 'success',
    avatar: 'A',
    color: '#4338CA',
    members: 5,
    deadline: '2026-06-15',
    createdDate: '2025-01-10',
    category: 'Engineering',
  },
  {
    id: 2,
    name: 'Project Beta',
    description: 'Mobile application redesign with improved UX and accessibility.',
    owner: 'James Wilson',
    ownerInitials: 'JW',
    status: 'Planning',
    statusSeverity: 'info',
    avatar: 'B',
    color: '#0891B2',
    members: 3,
    deadline: '2026-08-01',
    createdDate: '2025-03-05',
    category: 'Design',
  },
  {
    id: 3,
    name: 'Project Gamma',
    description: 'Infrastructure migration to cloud-native architecture.',
    owner: 'Maria Lopez',
    ownerInitials: 'ML',
    status: 'At Risk',
    statusSeverity: 'warn',
    avatar: 'G',
    color: '#DC2626',
    members: 8,
    deadline: '2026-04-30',
    createdDate: '2025-02-20',
    category: 'DevOps',
  },
];

export const mockStats: DashboardStats[] = [
  { label: 'Total Projects', value: '24', icon: 'pi pi-folder' },
  { label: 'Active', value: '12', icon: 'pi pi-check-circle' },
  { label: 'At Risk', value: '3', icon: 'pi pi-exclamation-triangle' },
  { label: 'Members', value: '48', icon: 'pi pi-users' },
];

export interface ProjectServiceMockState {
  projects?: FakeResourceState<Project[]>;
  stats?: FakeResourceState<DashboardStats[]>;
  /** State returned by `projectById()` (the detail page).*/
  projectById?: FakeResourceState<Project>;
}

export function projectServiceMock(state: ProjectServiceMockState = {}): ProjectService {
  return {
    projects: fakeResource(state.projects ?? {}),
    stats: fakeResource(state.stats ?? {}),
    projectById: () => fakeResource(state.projectById ?? {}),
  } as unknown as ProjectService;
}
