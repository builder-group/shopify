import { reactExtension } from '@shopify/ui-extensions-react/admin';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { BannerBlock, LoadEnergyLabelBlock, UpdateEnergyLabelMetaFieldsBlock } from './components';
import { appConfig } from './environment';
import {
	$extensionContext,
	applyEnergyLabelToMetaFieldsForm,
	loadEnergyLabelFormMetadata,
	t,
	TEnergyLabel
} from './lib';

const queryClient = new QueryClient();

export default reactExtension(appConfig.target, async (api) => {
	$extensionContext.set(api);

	const productId = api.data.selected[0]?.id;
	if (productId == null) {
		return <BannerBlock content={t('banner.error.productIdMissing')} tone="critical" />;
	}

	// const result = await deleteMetafieldDefinition({
	// 	id: 'gid://shopify/MetafieldDefinition/98728804616',
	// 	deleteAllAssociatedMetafields: true
	// });
	// console.log('deleteMetafieldDefinition', { result });

	const energyLabelResult = await loadEnergyLabelFormMetadata(productId);
	if (energyLabelResult.isErr()) {
		return <BannerBlock content={t('banner.error.metadataReadError')} tone="critical" />;
	}

	const energyLabel = energyLabelResult.value;
	if (energyLabel != null) {
		applyEnergyLabelToMetaFieldsForm(energyLabel);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Block energyLabel={energyLabel} productId={productId} />
		</QueryClientProvider>
	);
});

const Block: React.FC<TProps> = (props) => {
	const { productId } = props;
	const [energyLabel, setEnergyLabel] = React.useState(props.energyLabel);
	const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

	if (energyLabel == null) {
		return (
			<LoadEnergyLabelBlock
				onEnergyLabelSubmit={(energyLabel) => {
					applyEnergyLabelToMetaFieldsForm(energyLabel);
					setEnergyLabel(energyLabel);
					setSuccessMessage(
						t('banner.success.energyLabelFound', {
							productName: energyLabel.modelIdentifier
						})
					);
				}}
				productId={productId}
			/>
		);
	}

	return (
		<UpdateEnergyLabelMetaFieldsBlock
			energyLabel={energyLabel}
			successMessage={successMessage ?? undefined}
		/>
	);
};

interface TProps {
	energyLabel: TEnergyLabel | null;
	productId: string;
}
