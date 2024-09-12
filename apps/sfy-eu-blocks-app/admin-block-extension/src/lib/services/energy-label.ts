import {
	DeleteMetafieldMutation,
	GetMetafieldValueQuery,
	UpdateMetafieldMutation
} from '@repo/sfy-utils';
import {
	getLabelUrl,
	getLanguageSet,
	getSheetUrl,
	TEnergyClass,
	TLabelFormat,
	TSheetLanguage
} from 'eprel-client';
import { Err, FetchError, isStatusCode, Ok, TResult } from 'feature-fetch';

import { appConfig, coreClient, q } from '../../environment';

export async function updateEnergyLabelInMetafields(productId: string, energyLabel: TEnergyLabel) {
	return q(UpdateMetafieldMutation, {
		productId,
		namespace: appConfig.metafields.energyLabel.namespace,
		namespaceName: 'Energy Label',
		key: appConfig.metafields.energyLabel.key,
		type: appConfig.metafields.energyLabel.contentType,
		value: JSON.stringify(energyLabel)
	});
}

export async function getEnergyLabelFormMetafields(
	productId: string
): Promise<TResult<TEnergyLabel | null, FetchError>> {
	const result = await q(GetMetafieldValueQuery, {
		productId: productId,
		namespace: appConfig.metafields.energyLabel.namespace,
		key: appConfig.metafields.energyLabel.key
	});

	if (result.isErr()) {
		return Err(result.error);
	}

	const productLabelString = result.value.product?.metafield?.value;
	if (productLabelString == null) {
		return Ok(null);
	}

	try {
		return Ok(JSON.parse(productLabelString) as TEnergyLabel);
	} catch (e) {}

	return Ok(null);
}

export async function deleteEnergyLabelFromMetafields(productId: string) {
	return q(DeleteMetafieldMutation, {
		productId,
		namespace: appConfig.metafields.energyLabel.namespace,
		key: appConfig.metafields.energyLabel.key
	});
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
			// Seems like EPREL API returns 403 if Energy Label does not exist
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
	const sheetUrlMap: Record<TSheetLanguage, string> = {} as Record<TSheetLanguage, string>;
	for (const language of languageSet) {
		const url = getSheetUrl(productGroup, registrationNumber, language);
		if (language != null && url != null) {
			sheetUrlMap[language as TSheetLanguage] = url;
		}
	}

	return Ok({
		registrationNumber,
		energyClass: energyClass as TEnergyClass,
		modelIdentifier,
		label: {
			urlMap: {
				PDF: getLabelUrl(productGroup, registrationNumber, 'PDF'),
				PNG: getLabelUrl(productGroup, registrationNumber, 'PNG'),
				SVG: getLabelUrl(productGroup, registrationNumber, 'SVG')
			}
		},
		sheet: {
			urlMap: sheetUrlMap,
			fallbackLanguage:
				sheetUrlMap['EN'] != null ? 'EN' : ((Object.keys(sheetUrlMap)[0] as TSheetLanguage) ?? 'EN')
		}
	});
}

export interface TEnergyLabel {
	registrationNumber: string;
	modelIdentifier: string;
	energyClass: TEnergyClass;
	label: {
		urlMap: Record<TLabelFormat, string>;
	};
	sheet: {
		urlMap: Partial<Record<TSheetLanguage, string>>;
		fallbackLanguage: TSheetLanguage;
	};
}
