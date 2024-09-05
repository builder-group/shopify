import type { TEnergyClass, TLabelFormat, TSheetLanguage } from 'eprel-client';
import { Err, FetchError, Ok, TResult } from 'feature-fetch';

import { appConfig } from '../../environment';
import { getMetafieldQuery } from '../graphql';

export async function getEnergyLabelFormMetafields(
	productId: string
): Promise<TResult<TEnergyLabel | null, FetchError>> {
	const result = await getMetafieldQuery({
		productId: productId,
		namespace: appConfig.metafields.energyLabel.namespace,
		key: appConfig.metafields.energyLabel.key
	});
	if (result.isErr()) {
		return Err(result.error);
	}

	const productLabelString = result.value.product.metafield?.value;
	if (productLabelString == null) {
		return Ok(null);
	}

	try {
		return Ok(JSON.parse(productLabelString) as TEnergyLabel);
	} catch (e) {}

	return Ok(null);
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
