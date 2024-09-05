import {
	BlockSpacer,
	BlockStack,
	Image,
	InlineStack,
	Link,
	Pressable,
	reactExtension
} from '@shopify/ui-extensions-react/checkout';
import { StandardApi } from '@shopify/ui-extensions/checkout';
import { countryToSheetLanguage, TSheetLanguage } from 'eprel-client';
import React from 'react';

import { $extensionContext, appConfig, coreApiConfig } from './environment';
import { getEnergyLabelFormMetafields, TEnergyLabel } from './lib';

export default reactExtension(appConfig.target, async (api) => {
	$extensionContext.set(api);

	const productId = api.target.current.merchandise.product.id;

	const energyLabelResult = await getEnergyLabelFormMetafields(productId);
	if (energyLabelResult.isErr()) {
		return <></>;
	}
	const energyLabel = energyLabelResult.value;
	if (energyLabel == null) {
		return <></>;
	}

	return (
		<Extension
			energyClass={energyLabel.energyClass}
			labelUrl={energyLabel.label.urlMap.PDF}
			sheetUrl={findSheetUrl(api, energyLabel) ?? undefined}
		/>
	);
});

const findSheetUrl = (
	api: StandardApi<typeof appConfig.target>,
	energyLabel: TEnergyLabel
): string | null => {
	const currentCountry = api.localization.country.current?.isoCode ?? '';
	const currentMarket = api.localization.market.current?.handle ?? '';
	const currentLanguage = api.localization.language.current.isoCode;

	const countryLanguages = [...currentCountry.split('-'), currentMarket].flatMap(
		(locale) => countryToSheetLanguage[locale] ?? []
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
};

const Extension: React.FC<TProps> = (props) => {
	const { energyClass, sheetUrl, labelUrl } = props;

	return (
		<BlockStack>
			<BlockSpacer spacing={'none'} />
			<InlineStack>
				<Pressable to={labelUrl}>
					<Image
						accessibilityDescription={`Energy Label Efficiency Class ${energyClass}`}
						source={`${coreApiConfig.baseUrl}/v1/energy-label/efficiency-class/arrow.svg?efficiencyClass=${energyClass}&size=20`}
					/>
				</Pressable>
				{sheetUrl != null && <Link to={sheetUrl}>Product Datasheet</Link>}
			</InlineStack>
		</BlockStack>
	);
};

interface TProps {
	energyClass: TEnergyLabel['energyClass'];
	sheetUrl?: string;
	labelUrl: string;
}
