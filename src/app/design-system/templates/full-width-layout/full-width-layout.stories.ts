import type { Meta, StoryObj } from '@storybook/angular';
import { DsFullWidthLayout } from './full-width-layout';

const meta: Meta<DsFullWidthLayout> = {
  title: 'Design System/Templates/FullWidthLayout',
  component: DsFullWidthLayout,
};
export default meta;
type Story = StoryObj<DsFullWidthLayout>;

const placeholder = `background: var(--p-content-border-color); border-radius: 8px; padding: 48px; color: var(--p-text-muted-color); text-align: center;`;

// Wide column filling the available width (e.g. a list page).
export const FullWidth: Story = {
  args: { title: 'Projects', maxWidth: 'none' },
  render: (args) => ({
    props: args,
    template: `
      <ds-full-width-layout [title]="title" [maxWidth]="maxWidth">
        <div style="${placeholder}">[default slot] — projected organism</div>
      </ds-full-width-layout>
    `,
  }),
};

// Narrow centered reading column (e.g. a detail page).
export const Narrow: Story = {
  args: { maxWidth: '720px' },
  render: (args) => ({
    props: args,
    template: `
      <ds-full-width-layout [maxWidth]="maxWidth">
        <div style="${placeholder}">[default slot] — projected organism</div>
      </ds-full-width-layout>
    `,
  }),
};
