import { RequestError } from 'eprel-client';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';
import { AppError } from '@blgc/openapi-router';
import { extractErrorData } from '@blgc/utils';

import { eprelClient } from '../../eprel-client';
import { openApiRouter } from '../router';

openApiRouter.get('/product-groups', {
	handler: async (c) => {
		try {
			const productGroups = await eprelClient.getProductGroups();
			return c.json(productGroups);
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

		try {
			const { hits = [] } = await eprelClient.getModelsInProductGroup(productGroup, {
				filter: {
					modelIdentifier: model
				}
			});
			if (hits.length === 0) {
				throw new AppError('#ERR_NOT_FOUND', 404);
			}
			return c.json(hits[0]);
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
