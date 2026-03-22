import type { Meta, StoryObj } from '@storybook/angular';
import { DsButton } from './button';

const meta: Meta<DsButton> = {
  title: 'Design System/Atoms/Button',
  component: DsButton,
  argTypes: {
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'info', 'warn', 'help', 'contrast'],
    },
  },
};
export default meta;
type Story = StoryObj<DsButton>;

export const Primary: Story = {
  args: { label: 'Primary Button', severity: 'primary' },
};

export const Secondary: Story = {
  args: { label: 'Secondary', severity: 'secondary' },
};

export const Danger: Story = {
  args: { label: 'Delete', severity: 'danger' },
};

export const Outlined: Story = {
  args: { label: 'Outlined', severity: 'primary', outlined: true },
};

export const Success: Story = {
  args: { label: 'Success', severity: 'success' },
};

export const OutlinedSecondary: Story = {
  args: { label: 'Outlined Secondary', severity: 'secondary', outlined: true },
};
