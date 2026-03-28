import type { Meta, StoryObj } from '@storybook/angular';
import { within, userEvent } from '@storybook/test';
import { DsProjectTable } from './project-table';
import type { Project } from '../../../models';

const statuses: { status: string; severity: 'success' | 'info' | 'warn' | 'danger' }[] = [
  { status: 'Active', severity: 'success' },
  { status: 'Planning', severity: 'info' },
  { status: 'At Risk', severity: 'warn' },
  { status: 'Overdue', severity: 'danger' },
];

const categories = ['Engineering', 'Design', 'Marketing', 'DevOps', 'Product', 'Research'];

const mockProjects: Project[] = Array.from({ length: 18 }, (_, i) => {
  const statusEntry = statuses[i % statuses.length];
  return {
    id: i + 1,
    name: `Project ${String.fromCharCode(65 + i)}${i >= 26 ? i.toString() : ''}`,
    description: `Description for project ${i + 1} covering key deliverables and milestones.`,
    owner: `Owner ${i + 1}`,
    ownerInitials: `O${i + 1}`,
    status: statusEntry.status,
    statusSeverity: statusEntry.severity,
    avatar: String.fromCharCode(65 + (i % 26)),
    color: ['#4338CA', '#0891B2', '#DC2626', '#16A34A', '#CA8A04', '#9333EA'][i % 6],
    members: (i % 8) + 2,
    deadline: `2026-${String(((i % 12) + 1)).padStart(2, '0')}-15`,
    createdDate: `2025-${String(((i % 12) + 1)).padStart(2, '0')}-01`,
    category: categories[i % categories.length],
  };
});

const meta: Meta<DsProjectTable> = {
  title: 'Design System/Organisms/ProjectTable',
  component: DsProjectTable,
};
export default meta;
type Story = StoryObj<DsProjectTable>;

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'Alpha');
  },
};

export const SearchNoResults: Story = {
  args: { isLoading: false, error: null, projects: mockProjects },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'zzzzz');
  },
};
