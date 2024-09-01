import { getLabelUrl, getLanguageSet, getSheetUrl, TSheetLanguage } from 'eprel-client';
import { Err, FetchError, isStatusCode, Ok, TResult } from 'feature-fetch';

import { coreClient } from '../clients';
import { applyMetafieldChange, getMetafield } from '../graphql';

export async function updateEnergyLabelInMetadata(productId: string, energyLabel: TEnergyLabel) {
	// await deleteMetafield({
	// 	id: productId,
	// 	namespace: '$app:energy_label',
	// 	key: 'energy_label'
	// });
	return await applyMetafieldChange({
		ownerId: productId,
		ownerType: 'PRODUCT',
		type: 'json',
		namespace: '$app:energy_label',
		key: 'energy_label',
		value: JSON.stringify(energyLabel),
		name: 'Energy Label'
	});
}

export async function loadEnergyLabelFormMetadata(
	productId: string
): Promise<TResult<TEnergyLabel | null, FetchError>> {
	const result = await getMetafield({
		id: productId,
		namespace: '$app:energy_label',
		key: 'energy_label'
	});
	if (result.isErr()) {
		return Err(result.error);
	}

	const productLabelString = result.value.data.data.product.metafield?.value;
	if (productLabelString == null) {
		return Ok(null);
	}

	try {
		return Ok(JSON.parse(productLabelString) as TEnergyLabel);
	} catch (e) {}

	return Ok(null);
}

export async function fetchEnergyLabel(
	registrationNumber: string
): Promise<TResult<TEnergyLabel | null, FetchError>> {
	// Fetch product details
	const productDetailsResult = await coreClient.get(
		'/v1/energy-label/product/{registrationNumber}',
		{
			pathParams: {
				registrationNumber
			}
		}
	);
	if (productDetailsResult.isErr()) {
		if (
			isStatusCode(productDetailsResult.error, 404) ||
			// Seems like EPREL API returns 403 if Energy Labeld does not exist
			isStatusCode(productDetailsResult.error, 403)
		) {
			return Ok(null);
		}
		return Err(productDetailsResult.error);
	}

	const { energyClass, modelIdentifier, productGroup, placementCountries } =
		productDetailsResult.value.data ?? {};
	if (
		energyClass == null ||
		modelIdentifier == null ||
		productGroup == null ||
		placementCountries == null
	) {
		return Ok(null);
	}

	// Construct sheet url map
	const languageSet = getLanguageSet(placementCountries);
	// @ts-expect-error -- Filled below
	const sheetUrlMap: Record<TSheetLanguage, string> = {};
	for (const language of languageSet) {
		const url = getSheetUrl(productGroup, registrationNumber, language);
		if (language != null && url != null) {
			sheetUrlMap[language as TSheetLanguage] = url;
		}
	}

	return Ok({
		registrationNumber,
		energyClass,
		modelIdentifier,
		pdfLabelUrl: getLabelUrl(productGroup, registrationNumber, 'PDF'),
		sheetUrlMap
	});
}

export interface TEnergyLabel {
	registrationNumber: string;
	modelIdentifier: string;
	energyClass: string; // 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
	pdfLabelUrl: string;
	sheetUrlMap: Record<TSheetLanguage, string>; // LanguageCode -> URL
}
