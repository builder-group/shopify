import {
	AdminBlock,
	BlockStack,
	Button,
	reactExtension,
	Text,
	useApi
} from '@shopify/ui-extensions-react/admin';
import React from 'react';

import { getMetafield, updateMetafield } from './graphql';

const TARGET = 'admin.product-details.block.render';

export default reactExtension(TARGET, () => <App />);

function App() {
	const { i18n, data } = useApi(TARGET);
	const productId = React.useMemo(() => data.selected?.[0]?.id, [data.selected[0]]);
	console.log({ data, productId });

	React.useEffect(() => {
		(async () => {
			if (productId != null) {
				const result = await getEnergyLabel(productId);
				const label = result.unwrap().data.data.product.metafield?.value;
				console.log({ result, label });
			}
		})();
	}, [productId]);

	const onSubmit = React.useCallback(async () => {
		if (productId != null) {
			const result = await updateEnergyLabel(productId, 123);
			console.log({ result });
		}
	}, [productId]);

	return (
		<AdminBlock title={i18n.translate('title')}>
			<BlockStack>
				<Text fontWeight="bold">Hello world</Text>
				<Button onClick={onSubmit}>Update Energy Label</Button>
			</BlockStack>
		</AdminBlock>
	);
}

async function updateEnergyLabel(id: string, energyLabel: number) {
	return await updateMetafield({
		ownerId: id,
		namespace: '$app:energy_label',
		key: 'energy_label',
		type: 'number_integer',
		value: energyLabel.toString(),
		name: 'Energy Label',
		ownerType: 'PRODUCT'
	});
}

async function getEnergyLabel(id: string) {
	return await getMetafield({
		id,
		namespace: '$app:energy_label',
		key: 'energy_label'
	});
}
