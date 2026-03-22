import type { Meta, StoryObj } from '@storybook/angular';
import { DsSearchBar } from './search-bar';

const meta: Meta<DsSearchBar> = {
  title: 'Design System/Molecules/SearchBar',
  component: DsSearchBar,
};
export default meta;
type Story = StoryObj<DsSearchBar>;

export const Default: Story = {
  args: {},
};

export const WithValue: Story = {
  args: { value: 'Alpha' },
};

export const CustomPlaceholder: Story = {
  args: { placeholder: 'Filter by name...' },
};
