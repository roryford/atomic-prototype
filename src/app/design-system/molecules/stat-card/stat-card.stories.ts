import type { Meta, StoryObj } from '@storybook/angular';
import { DsStatCard } from './stat-card';

const meta: Meta<DsStatCard> = {
  title: 'Design System/Molecules/StatCard',
  component: DsStatCard,
};
export default meta;
type Story = StoryObj<DsStatCard>;

export const Default: Story = {
  args: { label: 'Total Projects', value: '24', icon: 'pi-chart-bar' },
};

export const LongValue: Story = {
  args: { label: 'Revenue This Quarter', value: '$1,234,567', icon: 'pi-dollar' },
};

export const DifferentIcon: Story = {
  args: { label: 'Team Members', value: '8', icon: 'pi-users' },
};
