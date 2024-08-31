import {
	AdminBlock,
	Form,
	reactExtension,
	Section,
	Text,
	TextField,
	URLField,
	useApi
} from '@shopify/ui-extensions-react/admin';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { BannerBlock, CreateEnergyLabelBlock } from './components';
import { appConfig } from './environment';
import { loadEnergyLabelFormMetadata, TEnergyLabel } from './lib';

const queryClient = new QueryClient();

export default reactExtension(appConfig.target, async (api) => {
	const productId = api.data.selected[0]?.id;
	if (productId == null) {
		return <BannerBlock content={'Failed to identify product'} tone="critical" />;
	}

	const energyLabelResult = await loadEnergyLabelFormMetadata(productId);
	if (energyLabelResult.isErr()) {
		return (
			<BannerBlock content={'Failed to read or parse Energy Label metadata'} tone="critical" />
		);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Block energyLabel={energyLabelResult.value} />
		</QueryClientProvider>
	);
});

const Block: React.FC<TProps> = (props) => {
	const { energyLabel } = props;
	const { i18n } = useApi(appConfig.target);

	if (energyLabel == null) {
		return (
			<CreateEnergyLabelBlock
				onEnergyLabelSubmit={(energyLabel) => {
					console.log({ energyLabel });
					//TODO
				}}
			/>
		);
	}

	return (
		<AdminBlock title={i18n.translate('title')}>
			<Text>{energyLabel != null ? energyLabel.modelIdentifier : 'None'}</Text>

			<Form
				onReset={() => {
					// TODO
				}}
				onSubmit={() => {
					// TODO
				}}
			>
				<Section heading="Metafields">
					<TextField
						label="Registration Number"
						name="registrationNumber"
						// value={value}
						// error={error}
						onChange={(value) => {
							// TODO
						}}
					/>
					<TextField
						label="Model Identifier"
						name="modelIdentifier"
						// value={value}
						// error={error}
						onChange={(value) => {
							// TODO
						}}
					/>
					<TextField
						label="Energy Class"
						name="energyClass"
						// value={value}
						// error={error}
						onChange={(value) => {
							// TODO
						}}
					/>
				</Section>

				<Section heading="Sheets">
					<URLField
						label="DE"
						name="de"
						// value={value}
						// error={error}
						onChange={(value) => {
							// TODO
						}}
					/>
				</Section>
			</Form>
		</AdminBlock>
	);
};

interface TProps {
	energyLabel: TEnergyLabel | null;
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
