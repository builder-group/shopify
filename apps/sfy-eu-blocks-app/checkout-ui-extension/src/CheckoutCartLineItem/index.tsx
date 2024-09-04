import {
	BlockStack,
	Image,
	reactExtension,
	Text,
	useCartLineTarget
} from '@shopify/ui-extensions-react/checkout';

import { $extensionContext, appConfig } from './environment';
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
	const {
		merchandise: { title }
	} = useCartLineTarget();

	return (
		<BlockStack>
			<Text>
				Checkout - Line item title: {title} ({energyLabel.energyClass})
			</Text>
			<Image source={'https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg'} />
		</BlockStack>
	);
};

interface TProps {
	energyLabel: TEnergyLabel;
}
