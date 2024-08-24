import { customElement, noShadowDOM } from 'solid-element';

import '../app.css';

export const EnergyLabelElement = customElement(
	'energy-label-element',
	{}, // TODO: Figure out what props to pass
	() => {
		noShadowDOM();

		return <div>Hello world</div>;
	}
);
