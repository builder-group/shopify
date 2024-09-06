import {
	BlockStack,
	Image,
	InlineStack,
	Link,
	Pressable,
	reactExtension
} from '@shopify/ui-extensions-react/checkout';
import React from 'react';

import { coreApiConfig } from '../../environment';
import { findSheetUrl, getEnergyLabelFormMetafields, TEnergyLabel } from '../../lib';
import { $extensionContext, appConfig, q } from './environment';

export default reactExtension(appConfig.target, async (api) => {
	$extensionContext.set(api);

	const productId = api.target.current.merchandise.product.id;

	const energyLabelResult = await getEnergyLabelFormMetafields(productId, q);
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

const Extension: React.FC<TProps> = (props) => {
	const { energyClass, sheetUrl, labelUrl } = props;

	return (
		<BlockStack>
			<InlineStack>
				<Pressable to={labelUrl}>
					<Image
						accessibilityDescription={`Energy Label Efficiency Class ${energyClass}`}
						source={`${coreApiConfig.baseUrl}/v1/energy-label/energy-class/arrow.svg?energyClass=${energyClass}&size=20`}
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
