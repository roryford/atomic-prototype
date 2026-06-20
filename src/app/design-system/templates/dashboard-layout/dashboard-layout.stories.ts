import type { Meta, StoryObj } from '@storybook/angular';
import { DsDashboardLayout } from './dashboard-layout';

const meta: Meta<DsDashboardLayout> = {
  title: 'Design System/Templates/DashboardLayout',
  component: DsDashboardLayout,
};
export default meta;
type Story = StoryObj<DsDashboardLayout>;

// Templates render zero real data — these stories use placeholder boxes to make
// the header and content slots visible.
const slot = `background: var(--p-content-border-color); border-radius: 8px; padding: 24px; color: var(--p-text-muted-color); text-align: center;`;

export const Default: Story = {
  render: () => ({
    template: `
      <ds-dashboard-layout>
        <h1 header style="margin: 0; color: var(--p-text-color);">Page Title</h1>
        <div header style="${slot}">[header] — actions</div>
        <div style="${slot}; margin-bottom: 16px;">[default slot] — projected organism</div>
        <div style="${slot}">[default slot] — projected organism</div>
      </ds-dashboard-layout>
    `,
  }),
};
