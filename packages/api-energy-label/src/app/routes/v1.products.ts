import { type energyLabelApiV1 } from '@repo/types/api';
import { RequestError } from 'eprel-client';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';
import { AppError } from '@blgc/openapi-router';
import { extractErrorData } from '@blgc/utils';

import { eprelClient } from '../../eprel-client';
import { openApiRouter } from '../router';

const LanguageEnum = {
	BG: 'BG',
	CS: 'CS',
	DA: 'DA',
	DE: 'DE',
	ET: 'ET',
	EL: 'EL',
	EN: 'EN',
	ES: 'ES',
	FR: 'FR',
	GA: 'GA',
	HR: 'HR',
	IT: 'IT',
	LV: 'LV',
	LT: 'LT',
	HU: 'HU',
	MT: 'MT',
	NL: 'NL',
	PL: 'PL',
	PT: 'PT',
	RO: 'RO',
	SK: 'SK',
	SL: 'SL',
	FI: 'FI',
	SV: 'SV'
} as const;

openApiRouter.get('/products/{registrationNumber}/labels', {
	pathValidator: vValidator(
		v.object({
			registrationNumber: v.pipe(v.string(), v.nonEmpty())
		})
	),
	handler: async (c) => {
		const { registrationNumber } = c.req.valid('param');

		try {
			// TODO: Construct addresses manually.. the URL pattern should be always the same
			const { address } = await eprelClient.getProductLabels(registrationNumber, {
				noRedirect: true
			});
			if (address == null) {
				throw new AppError('#ERR_NOT_FOUND', 404);
			}
			return c.json<energyLabelApiV1.components['schemas']['LabelUrlsDto']>({ urls: [address] });
		} catch (e) {
			if (e instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', e.status, {
					description: e.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(e).message });
		}
	}
});

openApiRouter.get('/products/{registrationNumber}/sheets', {
	pathValidator: vValidator(
		v.object({
			registrationNumber: v.pipe(v.string(), v.nonEmpty())
		})
	),
	queryValidator: vValidator(
		v.object({
			language: v.optional(v.enum(LanguageEnum))
		})
	),
	handler: async (c) => {
		const { registrationNumber } = c.req.valid('param');

		try {
			// TODO: Construct addresses manually.. the URL pattern should be always the same
			const { address } = await eprelClient.getProductFiches(registrationNumber, {
				noRedirect: true
			});
			if (address == null) {
				throw new AppError('#ERR_NOT_FOUND', 404);
			}
			return c.json<energyLabelApiV1.components['schemas']['SheetUrlsDto']>({ urls: [address] });
		} catch (e) {
			if (e instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', e.status, {
					description: e.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(e).message });
		}
	}
});
