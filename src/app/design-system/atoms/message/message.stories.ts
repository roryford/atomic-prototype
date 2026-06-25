import type { Meta, StoryObj } from '@storybook/angular';
import { DsMessage } from './message';

const meta: Meta<DsMessage> = {
  title: 'Design System/Atoms/Message',
  component: DsMessage,
  argTypes: {
    severity: {
      control: 'select',
      options: ['success', 'info', 'warn', 'error', 'secondary', 'contrast'],
    },
  },
};
export default meta;
type Story = StoryObj<DsMessage>;

export const ErrorMessage: Story = {
  args: { severity: 'error', text: 'Project not found' },
};

export const Info: Story = {
  args: { severity: 'info', text: 'Changes are saved automatically' },
};

export const Success: Story = {
  args: { severity: 'success', text: 'Project updated' },
};

export const Warn: Story = {
  args: { severity: 'warn', text: 'This project is at risk' },
};
