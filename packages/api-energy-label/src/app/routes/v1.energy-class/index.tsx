import { ENERGY_CLASSES } from 'eprel-client';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { openApiRouter } from '../../router';
import { EfficiencyArrowLg, EfficiencyArrowSm } from './components';

openApiRouter.get('/energy-class/arrow.svg', {
	queryValidator: vValidator(
		v.object({
			energyClass: v.picklist(ENERGY_CLASSES),
			variant: v.optional(v.picklist(['SM', 'LG'])),
			size: v.optional(v.number())
		})
	),
	handler: (c) => {
		const { energyClass, size = 56, variant = 'SM' } = c.req.valid('query');

		let svg;
		switch (variant) {
			case 'SM':
				svg = <EfficiencyArrowSm energyClass={energyClass} size={size} />;
				break;
			case 'LG':
				svg = <EfficiencyArrowLg energyClass={energyClass} size={size} />;
				break;
		}

		return c.html(svg, 200, {
			'Content-Type': 'image/svg+xml;charset=utf-8'
		}) as any;
	}
});
