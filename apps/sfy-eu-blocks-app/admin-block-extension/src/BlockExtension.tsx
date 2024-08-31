import { reactExtension } from '@shopify/ui-extensions-react/admin';
import { mapOk } from 'feature-fetch';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { applyMetafieldChange, getMetafield } from './lib';

const TARGET = 'admin.product-details.block.render';

const queryClient = new QueryClient();

export default reactExtension(TARGET, async (api) => {
	const productId = api.data.selected[0]?.id;
	if (productId == null) {
		return null as any; // TODO: General error
	}

	const energyLabel = await getEnergyLabel(productId);
	if (energyLabel.isErr()) {
		return null as any; // TODO: Shopify Metafield error
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Block />
		</QueryClientProvider>
	);
});

const Block: React.FC = () => {
	return <p>TODO</p>;
};

interface TProps {
	energyLabel: {
		number: number;
	};
}

// function App() {
// 	// const { i18n, data } = useApi(TARGET);
// 	// const productId = React.useMemo(() => data.selected?.[0]?.id, [data.selected[0]]);
// 	// const {
// 	// 	status,
// 	// 	data: selectedEnergyLabel,
// 	// 	isLoading: isLoadingSelectedEnergyLabel,
// 	// 	error
// 	// } = useQuery({
// 	// 	queryKey: ['energy-label', productId],
// 	// 	queryFn: async () => {
// 	// 		if (productId != null) {
// 	// 			const result = await getEnergyLabel(productId);
// 	// 			return result.unwrap();
// 	// 		}
// 	// 		return undefined;
// 	// 	}
// 	// });
// 	// const [energyLabelInput, setEnergyLabelInput] = React.useState<string>('');

// 	// const { data: productGroups, isLoading: isLoadingProductGroups } = useQuery({
// 	// 	queryKey: ['energy-label', 'product-groups'],
// 	// 	queryFn: async () => {
// 	// 		const result = await coreClient.get('/v1/energy-label/product-groups');
// 	// 		return result.unwrap().data;
// 	// 	}
// 	// });

// 	// React.useEffect(() => {
// 	// 	if (status === 'success' && selectedEnergyLabel != null) {
// 	// 		setEnergyLabelInput(selectedEnergyLabel);
// 	// 	}
// 	// }, [selectedEnergyLabel, status]);

// 	// const onSubmit = React.useCallback(async () => {
// 	// 	if (productId != null) {
// 	// 		const result = await updateEnergyLabel(productId, 123);
// 	// 		console.log({ result });
// 	// 	}
// 	// }, [productId]);

// 	// return (
// 	// 	<AdminBlock title={i18n.translate('title')}>
// 	// 		<BlockStack>
// 	// 			<Select
// 	// 				label="Date range"
// 	// 				options={
// 	// 					productGroups?.map((productGroup) => ({
// 	// 						label: productGroup.name as string,
// 	// 						value: productGroup.code
// 	// 					})) ?? []
// 	// 				}
// 	// 				value={isLoadingProductGroups ? 'Loading..' : undefined}
// 	// 				disabled={isLoadingProductGroups}
// 	// 			/>
// 	// 			<TextField
// 	// 				label="EnergyLabel"
// 	// 				type="number"
// 	// 				value={energyLabelInput}
// 	// 				onChange={setEnergyLabelInput}
// 	// 				autoComplete="off"
// 	// 				loading={isLoadingSelectedEnergyLabel}
// 	// 			/>
// 	// 			<Button onClick={onSubmit}>Update Energy Label</Button>
// 	// 		</BlockStack>
// 	// 	</AdminBlock>
// 	// );

// 	// const { i18n, data } = useApi(TARGET);
// 	// const productId = React.useMemo(() => data.selected?.[0]?.id, [data.selected[0]]);

// 	// return (
// 	// 	<AdminBlock title={i18n.translate('title')}>
// 	// 		<BlockStack>
// 	// 			<Select label="Category" options={[]} />
// 	// 			<TextField label="Energy Label Number" />
// 	// 			<Button
// 	// 				onPress={() => {
// 	// 					console.log('onPress event');
// 	// 				}}
// 	// 			>
// 	// 				Save
// 	// 			</Button>
// 	// 		</BlockStack>
// 	// 	</AdminBlock>
// 	// );

// 	const [value, setValue] = React.useState(settings);
// 	const [error, setError] = React.useState();

// 	return (
// 		<FunctionSettings
// 			onError={(errors) => {
// 				setError(errors[0]?.message);
// 			}}
// 		>
// 			<Section heading="Settings">
// 				<TextField
// 					label="Name"
// 					name="name"
// 					value={value}
// 					error={error}
// 					onChange={(value) => {
// 						setValue(value);
// 						setError(undefined);
// 						applyMetafieldsChange({
// 							type: 'updateMetafield',
// 							namespace: '$app:my_namespace',
// 							key: 'name',
// 							value,
// 							valueType: 'single_line_text_field'
// 						});
// 					}}
// 				/>
// 			</Section>
// 		</FunctionSettings>
// 	);
// }

async function updateEnergyLabel(id: string, energyLabel: number) {
	// applyMetafieldsChange({
	// 	type: 'updateMetafield',
	// 	namespace: '$app:my_namespace',
	// 	key: 'name',
	// 	value,
	// 	valueType: 'single_line_text_field'
	// });
	return await applyMetafieldChange({
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
	const result = await getMetafield({
		id,
		namespace: '$app:energy_label',
		key: 'energy_label'
	});
	return mapOk(result, (r) => r.data.data.product.metafield?.value);
}
