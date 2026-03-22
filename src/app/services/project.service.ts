import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Project, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  projects = httpResource<Project[]>(() => '/api/projects');
  stats = httpResource<DashboardStats[]>(() => '/api/stats');

  projectById(id: number) {
    return httpResource<Project>(() => `/api/projects/${id}`);
  }
}
