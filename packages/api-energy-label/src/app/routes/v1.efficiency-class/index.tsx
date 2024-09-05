import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { openApiRouter } from '../../router';
import { EfficiencyArrowLg, EfficiencyArrowSm } from './components';

openApiRouter.get('/efficiency-class/arrow', {
	queryValidator: vValidator(
		v.object({
			efficiencyClass: v.picklist(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
			style: v.optional(v.picklist(['SM', 'LG'])),
			size: v.optional(v.number())
		})
	),
	handler: (c) => {
		const { efficiencyClass, size = 56, style = 'SM' } = c.req.valid('query');

		let svg;
		switch (style) {
			case 'SM':
				svg = <EfficiencyArrowSm efficiencyClass={efficiencyClass} size={size} />;
				break;
			case 'LG':
				svg = <EfficiencyArrowLg efficiencyClass={efficiencyClass} size={size} />;
				break;
		}

		return c.html(svg, 200, {
			'Content-Type': 'image/svg+xml;charset=utf-8'
		}) as any;
	}
});
