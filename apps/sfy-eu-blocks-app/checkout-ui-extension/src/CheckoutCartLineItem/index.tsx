import {
	BlockStack,
	Image,
	InlineStack,
	Link,
	Pressable,
	reactExtension
} from '@shopify/ui-extensions-react/checkout';
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

	console.log('Checkout Cart Line', {
		energyLabel,
		productId,
		metafields: api.appMetafields.current
	});

	return <Extension energyLabel={energyLabel} />;
});

const Extension: React.FC<TProps> = (props) => {
	const { energyLabel } = props;
	const sheetUrl = React.useMemo(
		() => (energyLabel.sheetUrlMap as Record<string, string>)['EN'],
		[energyLabel.sheetUrlMap]
	);

	return (
		<BlockStack>
			<InlineStack>
				<Pressable to={energyLabel.labelUrlMap.PDF}>
					<Image
						// alt={`Energy Label Efficiency Class ${energyLabel.energyClass}`}
						source={`${coreApiConfig.baseUrl}/v1/energy-label/efficiency-class/arrow.svg?efficiencyClass=${energyLabel.energyClass}&size=20`}
					/>
				</Pressable>
				<Link to={sheetUrl}>Product Datasheet</Link>
			</InlineStack>
		</BlockStack>
	);
};

interface TProps {
	energyLabel: TEnergyLabel;
}
