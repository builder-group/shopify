import {
	AdminBlock,
	Banner,
	BlockStack,
	Paragraph,
	reactExtension
} from '@shopify/ui-extensions-react/admin';
import { useGlobalState } from 'feature-react/state';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { BannerBlock, LoadEnergyLabelBlock, UpdateEnergyLabelMetaFieldsBlock } from './components';
import { $extensionContext, appConfig, t } from './environment';
import {
	$banner,
	$energyLabel,
	applyEnergyLabelToUpdateMetafieldForm,
	getEnergyLabelFormMetafields
} from './lib';

const queryClient = new QueryClient();

// TODO:
// - Upload Label PDF (Optional, served from EU CDN by default)
// - Upload Sheets PDF (Optional, served from EU CDN by default)
// - Upload Label SVG (A - G) since we can't add custom components e.g. to checkout
//   and why serve it on our CDN if we can serve it via Shopify CDN
//
// Example Label:
// https://cdn.shopify.com/s/files/1/0878/3269/0952/files/Label_550826.pdf

export default reactExtension(appConfig.target, async (api) => {
	$extensionContext.set(api);

	const productId = api.data.selected[0]?.id;
	if (productId == null) {
		return <BannerBlock content={t('banner.error.productIdMissing')} tone="critical" />;
	}

	const energyLabelResult = await getEnergyLabelFormMetafields(productId);
	if (energyLabelResult.isErr()) {
		return (
			<BannerBlock
				content={t('banner.error.metadataReadError', {
					errorMessage: energyLabelResult.error.message
				})}
				tone="critical"
			/>
		);
	}

	const energyLabel = energyLabelResult.value;
	if (energyLabel != null) {
		applyEnergyLabelToUpdateMetafieldForm(energyLabel);
	}
	$energyLabel.set(energyLabel);

	return (
		<QueryClientProvider client={queryClient}>
			<Extension productId={productId} />
		</QueryClientProvider>
	);
});

const Extension: React.FC<TProps> = (props) => {
	const { productId } = props;
	const banner = useGlobalState($banner);
	const energyLabel = useGlobalState($energyLabel);

	return (
		<AdminBlock title={t('title')}>
			<BlockStack gap={true}>
				{banner != null && (
					<Banner
						tone={banner.tone}
						title={banner.title}
						dismissible
						onDismiss={() => {
							$banner.set(null);
						}}
					>
						<Paragraph>{banner.content}</Paragraph>
					</Banner>
				)}
				{energyLabel != null ? (
					<UpdateEnergyLabelMetaFieldsBlock productId={productId} />
				) : (
					<LoadEnergyLabelBlock productId={productId} />
				)}
			</BlockStack>
		</AdminBlock>
	);
};

interface TProps {
	productId: string;
}
