import { TSheetLanguage } from 'eprel-client';
import { Err, FetchError, isStatusCode, Ok, TResult } from 'feature-fetch';

import { coreClient } from './clients';
import { applyMetafieldChange, getMetafield } from './graphql';

export async function updateEnergyLabelInMetadata(productId: string, energyLabel: TEnergyLabel) {
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

	const { energyClass, modelIdentifier } = productDetailsResult.value.data ?? {};
	if (energyClass == null || modelIdentifier == null) {
		return Ok(null);
	}

	const sheetUrlsResult = await coreClient.get(
		'/v1/energy-label/product/{registrationNumber}/sheets',
		{
			pathParams: {
				registrationNumber
			}
		}
	);
	if (sheetUrlsResult.isErr()) {
		return Err(sheetUrlsResult.error);
	}

	const sheetUrls = sheetUrlsResult.value.data;

	return Ok({
		registrationNumber,
		energyClass,
		modelIdentifier,
		sheetUrlMap: sheetUrls.reduce(
			(obj, { language, url }) => {
				if (language != null && url != null) {
					obj[language as TSheetLanguage] = url;
				}
				return obj;
			},
			{} as Record<TSheetLanguage, string>
		)
	});
}

export interface TEnergyLabel {
	registrationNumber: string;
	modelIdentifier: string;
	energyClass: string; // 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
	sheetUrlMap: Record<TSheetLanguage, string>; // LanguageCode -> URL
}
