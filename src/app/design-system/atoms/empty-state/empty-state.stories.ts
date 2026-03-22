import type { Meta, StoryObj } from '@storybook/angular';
import { DsEmptyState } from './empty-state';

const meta: Meta<DsEmptyState> = {
  title: 'Design System/Atoms/EmptyState',
  component: DsEmptyState,
};
export default meta;
type Story = StoryObj<DsEmptyState>;

export const Default: Story = {
  args: { icon: 'pi-inbox', message: 'No data available' },
};

export const WithAction: Story = {
  args: { icon: 'pi-inbox', message: 'No projects found', actionLabel: 'Create Project' },
};

export const CustomIcon: Story = {
  args: { icon: 'pi-search', message: "No results for 'zzzzz'", actionLabel: 'Clear search' },
};

export const NoAction: Story = {
  args: { icon: 'pi-inbox', message: 'No stats available' },
};
