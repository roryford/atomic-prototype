import type { Meta, StoryObj } from '@storybook/angular';
import { DsSkeleton } from './skeleton';

const meta: Meta<DsSkeleton> = {
  title: 'Design System/Atoms/Skeleton',
  component: DsSkeleton,
  argTypes: {
    shape: {
      control: 'select',
      options: ['rectangle', 'circle'],
    },
  },
};
export default meta;
type Story = StoryObj<DsSkeleton>;

export const Text: Story = {
  args: { width: '200px', height: '1rem' },
};

export const Block: Story = {
  args: { width: '100%', height: '38px' },
};

export const Circle: Story = {
  args: { shape: 'circle', size: '4rem' },
};
