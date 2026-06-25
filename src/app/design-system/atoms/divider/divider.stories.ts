import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DsDivider } from './divider';

const meta: Meta<DsDivider> = {
  title: 'Design System/Atoms/Divider',
  component: DsDivider,
  decorators: [moduleMetadata({ imports: [DsDivider] })],
  argTypes: {
    layout: { control: 'select', options: ['horizontal', 'vertical'] },
    type: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
  },
  // Render content either side so the separator is visible in isolation.
  render: (args) => ({
    props: args,
    template: `<p>Above</p><ds-divider [layout]="layout" [type]="type" /><p>Below</p>`,
  }),
};
export default meta;
type Story = StoryObj<DsDivider>;

export const Horizontal: Story = {
  args: { layout: 'horizontal', type: 'solid' },
};

export const Dashed: Story = {
  args: { layout: 'horizontal', type: 'dashed' },
};
