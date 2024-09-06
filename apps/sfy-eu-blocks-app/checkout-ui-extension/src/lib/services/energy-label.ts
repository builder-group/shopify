import type { TEnergyClass, TLabelFormat, TSheetLanguage } from 'eprel-client';
import { Err, FetchError, Ok, TResult } from 'feature-fetch';

import { metafieldsConfig } from '../../environment';
import { getMetafieldQuery } from '../graphql';
import { TQuery } from '../types';

export async function getEnergyLabelFormMetafields(
	productId: string,
	query: TQuery
): Promise<TResult<TEnergyLabel | null, FetchError>> {
	const result = await getMetafieldQuery(
		{
			productId: productId,
			namespace: metafieldsConfig.energyLabel.namespace,
			key: metafieldsConfig.energyLabel.key
		},
		query
	);
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