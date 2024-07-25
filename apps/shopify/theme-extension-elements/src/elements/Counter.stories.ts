import type { Meta, StoryObj } from '@storybook/web-components';

import { CounterExtension } from './Counter';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/web-components/writing-stories/introduction
const meta = {
	title: 'ui/Counter',
	tags: ['autodocs'],
	render: (args) => new CounterExtension(args)
} satisfies Meta<typeof CounterExtension>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
