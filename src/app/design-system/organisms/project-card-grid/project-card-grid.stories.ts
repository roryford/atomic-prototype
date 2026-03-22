import type { Meta, StoryObj } from '@storybook/angular';
import { DsProjectCardGrid } from './project-card-grid';
import type { Project } from '../../../models';

const mockProjects: Project[] = [
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

const meta: Meta<DsProjectCardGrid> = {
  title: 'Design System/Organisms/ProjectCardGrid',
  component: DsProjectCardGrid,
};
export default meta;
type Story = StoryObj<DsProjectCardGrid>;

export const Loading: Story = {
  args: { isLoading: true, error: null, projects: [] },
};

export const Error: Story = {
  args: { isLoading: false, error: 'Unable to load projects. Please try again.', projects: [] },
};

export const Empty: Story = {
  args: { isLoading: false, error: null, projects: [] },
};

export const WithData: Story = {
  args: { isLoading: false, error: null, projects: mockProjects },
};
