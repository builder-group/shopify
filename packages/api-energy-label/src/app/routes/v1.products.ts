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

		// TODO: Construct addresses manually.. the URL pattern should be always the same
		const result = await eprelClient.getProductLabels(registrationNumber, {
			noRedirect: true
		});
		if (result.isErr()) {
			const { error } = result;
			if (error instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', error.status, {
					description: error.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(error).message });
		}

		const { address } = result.value;
		if (address == null) {
			throw new AppError('#ERR_NOT_FOUND', 404);
		}

		return c.json({ urls: [address] });
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

		// TODO: Construct addresses manually.. the URL pattern should be always the same
		const result = await eprelClient.getProductFiches(registrationNumber, {
			noRedirect: true
		});
		if (result.isErr()) {
			const { error } = result;
			if (error instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', error.status, {
					description: error.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(error).message });
		}

		const { address } = result.value;
		if (address == null) {
			throw new AppError('#ERR_NOT_FOUND', 404);
		}

		return c.json({ urls: [address] });
	}
});
