import { CustomerAccountStandardApi, StandardApi } from '@shopify/ui-extensions/checkout';
import { countryToSheetLanguage, TSheetLanguage } from 'eprel-client';

import { TEnergyLabel } from '../services';

export function findSheetUrl(
	api: StandardApi<any> | CustomerAccountStandardApi<any>,
	energyLabel: TEnergyLabel
): string | null {
	const currentCountry = api.localization.country.current?.isoCode ?? '';
	const currentMarket = api.localization.market.current?.handle ?? '';
	const currentLanguage = api.localization.language.current.isoCode;

	const countryLanguages = [...currentCountry.split('-'), currentMarket].flatMap(
		(country) => countryToSheetLanguage[country] ?? []
	);

	const potentialSheetLanguages = new Set<string>(
		[...currentLanguage.split('-'), ...countryLanguages].filter(Boolean).map((v) => v.toUpperCase())
	);

	for (const lang of potentialSheetLanguages) {
		const upperLang = lang.toUpperCase() as TSheetLanguage;
		const url = energyLabel.sheet.urlMap[upperLang];
		if (url != null) {
			return url;
		}
	}

	return energyLabel.sheet.urlMap[energyLabel.sheet.fallbackLanguage] ?? null;
}
