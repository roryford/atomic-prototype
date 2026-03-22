import type { Meta, StoryObj } from '@storybook/angular';
import { DsInput } from './input';

const meta: Meta<DsInput> = {
  title: 'Design System/Atoms/Input',
  component: DsInput,
};
export default meta;
type Story = StoryObj<DsInput>;

export const Default: Story = {
  args: {},
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Search projects...' },
};

export const WithValue: Story = {
  args: { value: 'Project Alpha', placeholder: 'Enter project name' },
};
