import { createState } from 'feature-react/state';

import { TEnergyLabel } from '.';

export const $energyLabel = createState<TEnergyLabel | null>(null);
export const $banner = createState<TStatus | null>(null);

interface TStatus {
	title?: string;
	tone: 'info' | 'success' | 'warning' | 'critical' | 'default';
	content: string;
	source: string;
}
