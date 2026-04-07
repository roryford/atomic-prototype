import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { DsFormField } from './form-field';
import { DsInput } from '../../atoms/input/input';

const meta: Meta<DsFormField> = {
  title: 'Design System/Molecules/FormField',
  component: DsFormField,
  decorators: [
    moduleMetadata({
      imports: [DsInput],
    }),
  ],
};
export default meta;
type Story = StoryObj<DsFormField>;

export const Default: Story = {
  args: { label: 'Project Name', inputId: 'story-project-name' },
  render: (args) => ({
    props: args,
    template: `
      <ds-form-field [label]="label" [inputId]="inputId">
        <ds-input placeholder="Enter project name" [id]="inputId" />
      </ds-form-field>
    `,
  }),
};

export const FullWidth: Story = {
  args: { label: 'Description', fullWidth: true, inputId: 'story-description' },
  render: (args) => ({
    props: args,
    template: `
      <ds-form-field [label]="label" [fullWidth]="fullWidth" [inputId]="inputId">
        <ds-input placeholder="Enter description" [id]="inputId" />
      </ds-form-field>
    `,
  }),
};
