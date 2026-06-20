import { signal } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { Project, DashboardStats } from '../models';
import projectsFixture from '../mocks/fixtures/projects.json';
import statsFixture from '../mocks/fixtures/stats.json';

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

// Reuse the same fixtures the dev server (MSW) serves, so Storybook page stories
// show the same data the app and e2e tests run against — one source of truth.
// The JSON widens `statusSeverity` to `string`, so cast back to the domain types.
export const mockProjects = projectsFixture as unknown as Project[];
export const mockStats = statsFixture as unknown as DashboardStats[];

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
