import { http, HttpResponse, delay } from 'msw';

import projects from './fixtures/projects.json';
import stats from './fixtures/stats.json';

export const handlers = [
  http.get('/api/projects', async () => {
    await delay(300);
    return HttpResponse.json(projects);
  }),

  http.get('/api/projects/:id', async ({ params }) => {
    await delay(200);
    const project = projects.find((p: any) => p.id === Number(params['id']));
    if (!project) {
      return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return HttpResponse.json(project);
  }),

  http.get('/api/stats', async () => {
    await delay(250);
    return HttpResponse.json(stats);
  }),
];
