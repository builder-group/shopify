import type { Meta, StoryObj } from '@storybook/web-components';

import { StarRatingElement } from './StarRating';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/web-components/writing-stories/introduction
const meta = {
	title: 'ui/StarRating',
	tags: ['autodocs'],
	render: (args) => new StarRatingElement(args)
} satisfies Meta<typeof StarRatingElement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
