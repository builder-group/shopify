import { RequestError } from 'eprel-client';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';
import { AppError } from '@blgc/openapi-router';
import { extractErrorData } from '@blgc/utils';

import { eprelClient } from '../../eprel-client';
import { openApiRouter } from '../router';

openApiRouter.get('/product-groups', {
	handler: async (c) => {
		const result = await eprelClient.getProductGroups();
		if (result.isErr()) {
			const { error } = result;
			if (error instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', error.status, {
					description: error.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(error).message });
		}
		return c.json(result.value);
	}
});

openApiRouter.get('/product-groups/{productGroup}/products', {
	pathValidator: vValidator(
		v.object({
			productGroup: v.pipe(v.string(), v.nonEmpty())
		})
	),
	queryValidator: vValidator(
		v.object({
			model: v.pipe(v.string(), v.nonEmpty())
		})
	),
	handler: async (c) => {
		const { productGroup } = c.req.valid('param');
		const { model } = c.req.valid('query');

		const result = await eprelClient.getModelsInProductGroup(productGroup, {
			filter: {
				modelIdentifier: model
			}
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
		const { hits = [] } = result.value;

		return c.json(
			hits.map((hit) => ({
				energyClass: hit.energyClass,
				eprelRegistrationNumber: hit.eprelRegistrationNumber,
				implementingAct: hit.implementingAct,
				modelIdentifier: hit.modelIdentifier,
				onMarketEndDate: hit.onMarketEndDate,
				onMarketStartDate: hit.onMarketStartDate,
				productGroup: hit.productGroup,
				status: hit.status
			}))
		);
	}
});
