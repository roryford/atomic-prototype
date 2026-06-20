import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { Dashboard } from './dashboard';
import { ProjectService } from '../../services/project.service';
import { projectServiceMock, mockProjects, mockStats } from '../mock-project-service';

const meta: Meta<Dashboard> = {
  title: 'Pages/Dashboard',
  component: Dashboard,
};
export default meta;
type Story = StoryObj<Dashboard>;

// Each story swaps in a ProjectService double driving the stat grid + card grid
// into a specific render state. Router is provided for the page's navigation.
const withState = (service: ProjectService) =>
  applicationConfig({
    providers: [provideRouter([]), { provide: ProjectService, useValue: service }],
  });

export const Loading: Story = {
  decorators: [
    withState(projectServiceMock({ projects: { isLoading: true }, stats: { isLoading: true } })),
  ],
};

export const Error: Story = {
  decorators: [
    withState(
      projectServiceMock({
        projects: { error: 'Unable to load projects.' },
        stats: { error: 'Unable to load stats.' },
      }),
    ),
  ],
};

export const Empty: Story = {
  decorators: [withState(projectServiceMock({ projects: { value: [] }, stats: { value: [] } }))],
};

export const WithData: Story = {
  decorators: [
    withState(
      projectServiceMock({ projects: { value: mockProjects }, stats: { value: mockStats } }),
    ),
  ],
};
