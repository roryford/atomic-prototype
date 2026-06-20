import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { ActivatedRoute, provideRouter, withDisabledInitialNavigation } from '@angular/router';
import { Detail } from './detail';
import { ProjectService } from '../../services/project.service';
import { projectServiceMock, mockProjects } from '../mock-project-service';

const meta: Meta<Detail> = {
  title: 'Pages/Detail',
  component: Detail,
};
export default meta;
type Story = StoryObj<Detail>;

// Detail reads `:id` from the route snapshot and calls `projectById()`, so each
// story provides both a fake route and a ProjectService double. There is no
// "empty" state for a single entity — a missing record renders as Error.
const fakeRoute = {
  snapshot: { paramMap: { get: (key: string) => (key === 'id' ? '1' : null) } },
};

const withState = (service: ProjectService) =>
  applicationConfig({
    providers: [
      provideRouter([], withDisabledInitialNavigation()),
      { provide: ProjectService, useValue: service },
      { provide: ActivatedRoute, useValue: fakeRoute },
    ],
  });

export const Loading: Story = {
  decorators: [withState(projectServiceMock({ projectById: { isLoading: true } }))],
};

export const Error: Story = {
  decorators: [withState(projectServiceMock({ projectById: { error: 'Project not found' } }))],
};

export const WithData: Story = {
  decorators: [withState(projectServiceMock({ projectById: { value: mockProjects[0] } }))],
};
