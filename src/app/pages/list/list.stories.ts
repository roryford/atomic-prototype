import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { ListPage } from './list';
import { ProjectService } from '../../services/project.service';
import { projectServiceMock, mockProjects } from '../mock-project-service';

const meta: Meta<ListPage> = {
  title: 'Pages/List',
  component: ListPage,
};
export default meta;
type Story = StoryObj<ListPage>;

const withState = (service: ProjectService) =>
  applicationConfig({
    providers: [provideRouter([]), { provide: ProjectService, useValue: service }],
  });

export const Loading: Story = {
  decorators: [withState(projectServiceMock({ projects: { isLoading: true } }))],
};

export const Error: Story = {
  decorators: [withState(projectServiceMock({ projects: { error: 'Unable to load projects.' } }))],
};

export const Empty: Story = {
  decorators: [withState(projectServiceMock({ projects: { value: [] } }))],
};

export const WithData: Story = {
  decorators: [withState(projectServiceMock({ projects: { value: mockProjects } }))],
};
