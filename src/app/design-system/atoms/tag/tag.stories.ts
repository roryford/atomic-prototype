import type { Meta, StoryObj } from '@storybook/angular';
import { DsTag } from './tag';

const meta: Meta<DsTag> = {
  title: 'Design System/Atoms/Tag',
  component: DsTag,
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warn', 'danger', 'secondary', 'contrast'],
    },
  },
};
export default meta;
type Story = StoryObj<DsTag>;

export const Success: Story = {
  args: { value: 'Active', severity: 'success' },
};

export const Warning: Story = {
  args: { value: 'At Risk', severity: 'warn' },
};

export const Danger: Story = {
  args: { value: 'Overdue', severity: 'danger' },
};

export const Info: Story = {
  args: { value: 'Planning', severity: 'info' },
};
