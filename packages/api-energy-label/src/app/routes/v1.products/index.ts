import { RequestError } from 'eprel-client';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';
import { AppError } from '@blgc/openapi-router';
import { extractErrorData } from '@blgc/utils';

import { eprelClient } from '../../../eprel-client';
import { openApiRouter } from '../../router';
import { countryToSheetLang, ESheetLanguage, type TSheetLanguageCode } from './sheet-language';

openApiRouter.get('/products/{registrationNumber}/labels', {
	pathValidator: vValidator(
		v.object({
			registrationNumber: v.pipe(v.string(), v.nonEmpty())
		})
	),
	parsePathParamsBlacklist: ['registrationNumber'],
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
	parsePathParamsBlacklist: ['registrationNumber'],
	queryValidator: vValidator(
		v.object({
			language: v.optional(v.enum(ESheetLanguage))
		})
	),
	handler: async (c) => {
		const { registrationNumber } = c.req.valid('param');
		const { language } = c.req.valid('query');

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
		const { productGroup, placementCountries } = data;

		const sheetUrls: { language: string; url: string }[] = [];

		// TODO: Split this request into two, one for single sheet url and one for all?

		// Find single sheet url for specific language
		if (language != null) {
			if (placementCountries != null && productGroup != null) {
				const languageSet = getLanguageSet(placementCountries);
				if (languageSet.has(language)) {
					sheetUrls.push({
						language,
						url: getSheetUrl(productGroup, registrationNumber, language)
					});
				}
			}
		}
		// Find all sheet urls for all available languages
		else if (productGroup != null && placementCountries != null) {
			const languageSet = getLanguageSet(placementCountries);
			sheetUrls.push(
				...Array.from(languageSet).map((l) => ({
					language: l,
					url: getSheetUrl(productGroup, registrationNumber, l)
				}))
			);
		}

		return c.json(sheetUrls);
	}
});

function getLanguageSet(
	placementCountries: {
		country?: string;
		orderNumber?: number;
	}[]
): Set<TSheetLanguageCode> {
	const languageSet = new Set<TSheetLanguageCode>();
	for (const placementCountry of placementCountries) {
		if (placementCountry.country != null) {
			const languages = countryToSheetLang[placementCountry.country];
			if (languages != null) {
				languages.forEach((lang) => languageSet.add(lang));
			}
		}
	}
	return languageSet;
}

function getSheetUrl(productGroup: string, registrationNumber: string, language: string): string {
	// `https://eprel.ec.europa.eu/api/products/${productGroup}/${registrationNumber}/fiches?language=${lang}`
	return `https://eprel.ec.europa.eu/fiches/${productGroup}/Fiche_${registrationNumber}_${language}.pdf`;
}
