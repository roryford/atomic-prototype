import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Project, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  projects = httpResource<Project[]>(() => '/api/projects');
  stats = httpResource<DashboardStats[]>(() => '/api/stats');

  /**
   * Builds a reactive resource for a single project. The `id` is a reactive
   * accessor (e.g. a signal) so the request re-runs whenever the id changes,
   * which makes /detail/1 -> /detail/2 re-fetch.
   */
  projectById(id: () => number | string) {
    return httpResource<Project>(() => `/api/projects/${id()}`);
  }
}
