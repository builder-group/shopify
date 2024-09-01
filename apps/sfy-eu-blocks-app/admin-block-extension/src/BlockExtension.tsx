import {
	AdminBlock,
	Form,
	reactExtension,
	Section,
	Text,
	TextField,
	URLField
} from '@shopify/ui-extensions-react/admin';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { BannerBlock, SearchEnergyLabelBlock } from './components';
import { appConfig } from './environment';
import { useExtensionContext } from './hooks';
import { $extensionContext, loadEnergyLabelFormMetadata, TEnergyLabel } from './lib';

const queryClient = new QueryClient();

export default reactExtension(appConfig.target, async (api) => {
	const productId = api.data.selected[0]?.id;
	$extensionContext.set(api);
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
			<Block energyLabel={energyLabelResult.value} productId={productId} />
		</QueryClientProvider>
	);
});

const Block: React.FC<TProps> = (props) => {
	const { productId } = props;
	const [energyLabel, setEnergyLabel] = React.useState(props.energyLabel);
	const { i18n } = useExtensionContext();

	if (energyLabel == null) {
		return (
			<SearchEnergyLabelBlock
				onEnergyLabelSubmit={(energyLabel) => {
					setEnergyLabel(energyLabel);
				}}
				productId={productId}
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
	productId: string;
}
