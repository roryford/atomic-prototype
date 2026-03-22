import type { Meta, StoryObj } from '@storybook/angular';
import { DsStatGrid } from './stat-grid';
import type { DashboardStats } from '../../../models';

const mockStats: DashboardStats[] = [
  { label: 'Total Projects', value: '24', icon: 'pi-chart-bar' },
  { label: 'Active Tasks', value: '142', icon: 'pi-check-circle' },
  { label: 'Team Members', value: '8', icon: 'pi-users' },
  { label: 'Completion Rate', value: '87%', icon: 'pi-percentage' },
];

const meta: Meta<DsStatGrid> = {
  title: 'Design System/Organisms/StatGrid',
  component: DsStatGrid,
};
export default meta;
type Story = StoryObj<DsStatGrid>;

export const Loading: Story = {
  args: { isLoading: true, error: null, stats: [] },
};

export const Error: Story = {
  args: { isLoading: false, error: 'Unable to load stats', stats: [] },
};

export const Empty: Story = {
  args: { isLoading: false, error: null, stats: [] },
};

export const WithData: Story = {
  args: { isLoading: false, error: null, stats: mockStats },
};
