import { ELabelFormat, ESheetLanguage, RequestError } from 'eprel-client';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';
import { AppError } from '@blgc/openapi-router';
import { extractErrorData } from '@blgc/utils';

import { eprelClient } from '../../environment';
import { openApiRouter } from '../router';

openApiRouter.get('/product/{registrationNumber}', {
	pathValidator: vValidator(
		v.object({
			registrationNumber: v.pipe(v.string(), v.nonEmpty())
		})
	),
	parsePathParamsBlacklist: ['registrationNumber'],
	handler: async (c) => {
		const { registrationNumber } = c.req.valid('param');

		const result = await eprelClient.getProductByRegistrationNumber(registrationNumber);
		if (result.isErr()) {
			const { error } = result;
			if (error instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', error.status, {
					description: error.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(error).message });
		}

		const data = result.value;
		if (data == null) {
			throw new AppError('#ERR_NOT_FOUND', 404);
		}

		return c.json(data);
	}
});

openApiRouter.get('/product/{registrationNumber}/sheets', {
	pathValidator: vValidator(
		v.object({
			registrationNumber: v.pipe(v.string(), v.nonEmpty())
		})
	),
	parsePathParamsBlacklist: ['registrationNumber'],
	handler: async (c) => {
		const { registrationNumber } = c.req.valid('param');

		const result = await eprelClient.getProductSheetUrls(registrationNumber);
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

openApiRouter.get('/product/{registrationNumber}/sheet', {
	pathValidator: vValidator(
		v.object({
			registrationNumber: v.pipe(v.string(), v.nonEmpty())
		})
	),
	parsePathParamsBlacklist: ['registrationNumber'],
	queryValidator: vValidator(
		v.object({
			language: v.optional(v.enum(ESheetLanguage))
		})
	),
	handler: async (c) => {
		const { registrationNumber } = c.req.valid('param');
		const { language = 'EN' } = c.req.valid('query');

		const result = await eprelClient.getProductSheetUrl(registrationNumber, language);
		if (result.isErr()) {
			const { error } = result;
			if (error instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', error.status, {
					description: error.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(error).message });
		}

		const url = result.value;
		if (url == null) {
			throw new AppError('#ERR_NOT_FOUND', 404);
		}

		return c.text(url);
	}
});

openApiRouter.get('/product/{registrationNumber}/label', {
	pathValidator: vValidator(
		v.object({
			registrationNumber: v.pipe(v.string(), v.nonEmpty())
		})
	),
	parsePathParamsBlacklist: ['registrationNumber'],
	queryValidator: vValidator(
		v.object({
			format: v.optional(v.enum(ELabelFormat))
		})
	),
	handler: async (c) => {
		const { registrationNumber } = c.req.valid('param');
		const { format = 'PDF' } = c.req.valid('query');

		const result = await eprelClient.getProductLabelUrl(registrationNumber, format);
		if (result.isErr()) {
			const { error } = result;
			if (error instanceof RequestError) {
				throw new AppError('#ERR_EPREL_API', error.status, {
					description: error.message
				});
			}
			throw new AppError('#ERR_INTERNAL', 500, { description: extractErrorData(error).message });
		}

		const url = result.value;
		if (url == null) {
			throw new AppError('#ERR_NOT_FOUND', 404);
		}

		return c.text(url);
	}
});
