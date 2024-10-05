import { TEnergyClass } from 'eprel-client';
import { customElement, noShadowDOM } from 'solid-element';

import '../app.css';

import { EfficiencyArrowLg, EfficiencyArrowSm } from '../components';

export const EnergyLabelElement = customElement<TProps>(
	'energy-label-element',
	{ variant: 'SM', size: 56, energyClass: 'A' },
	(props) => {
		noShadowDOM();

		const { energyClass, size = 56, variant = 'SM' } = props;

		switch (variant) {
			case 'SM':
				return <EfficiencyArrowSm energyClass={energyClass} size={size} />;
			case 'LG':
				return <EfficiencyArrowLg energyClass={energyClass} size={size} />;
		}
	}
);

interface TProps {
	variant: 'SM' | 'LG';
	size?: number;
	energyClass: TEnergyClass;
}
