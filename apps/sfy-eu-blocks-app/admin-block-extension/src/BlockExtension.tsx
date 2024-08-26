import {
	AdminBlock,
	BlockStack,
	Button,
	reactExtension,
	TextField,
	useApi
} from '@shopify/ui-extensions-react/admin';
import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

import { getMetafield, updateMetafield } from './graphql';

const TARGET = 'admin.product-details.block.render';

const queryClient = new QueryClient();

export default reactExtension(TARGET, () => (
	<QueryClientProvider client={queryClient}>
		<App />
	</QueryClientProvider>
));

function App() {
	const { i18n, data } = useApi(TARGET);
	const productId = React.useMemo(() => data.selected?.[0]?.id, [data.selected[0]]);
	const {
		status,
		data: loadedEnergyLabel,
		isLoading,
		error
	} = useQuery({
		queryKey: ['energy-label', productId],
		queryFn: async () => {
			if (productId != null) {
				const result = await getEnergyLabel(productId);
				return result.unwrap().data.data.product.metafield?.value;
			}
			return undefined;
		}
	});
	const [energyLabelInput, setEnergyLabelInput] = React.useState<string>('');

	React.useEffect(() => {
		if (status === 'success' && loadedEnergyLabel != null) {
			setEnergyLabelInput(loadedEnergyLabel);
		}
	}, [loadedEnergyLabel, status]);

	const onSubmit = React.useCallback(async () => {
		if (productId != null) {
			const result = await updateEnergyLabel(productId, 123);
			console.log({ result });
		}
	}, [productId]);

	return (
		<AdminBlock title={i18n.translate('title')}>
			<BlockStack>
				<TextField
					label="EnergyLabel"
					type="number"
					value={energyLabelInput}
					onChange={setEnergyLabelInput}
					autoComplete="off"
					loading={isLoading}
				/>
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
