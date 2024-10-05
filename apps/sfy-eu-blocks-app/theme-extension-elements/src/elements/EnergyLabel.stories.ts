import type { Meta, StoryObj } from '@storybook/web-components';

import { EnergyLabelElement } from './EnergyLabel';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/web-components/writing-stories/introduction
const meta = {
	title: 'ui/EnergyLabel',
	tags: ['autodocs'],
	render: (args) => new EnergyLabelElement(args)
} satisfies Meta<typeof EnergyLabelElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
