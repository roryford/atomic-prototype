import { http, HttpResponse, delay } from 'msw';

import type { Project, DashboardStats } from '../models';

import projects from './fixtures/projects.json';
import stats from './fixtures/stats.json';

const typedProjects = projects as Project[];
const typedStats = stats as DashboardStats[];

export const handlers = [
  http.get('/api/projects', async () => {
    await delay(300);
    return HttpResponse.json(typedProjects);
  }),

  http.get('/api/projects/:id', async ({ params }) => {
    await delay(200);
    const project = typedProjects.find((p) => p.id === Number(params['id']));
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return HttpResponse.json(project);
  }),

  http.get('/api/stats', async () => {
    await delay(250);
    return HttpResponse.json(typedStats);
  }),
];
