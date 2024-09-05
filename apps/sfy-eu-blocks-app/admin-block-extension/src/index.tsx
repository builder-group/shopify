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
	getEnergyLabelFormMetafields,
	getShopLocales
} from './lib';

const queryClient = new QueryClient();

export default reactExtension(appConfig.target, async (api) => {
	$extensionContext.set(api);

	const productId = api.data.selected[0]?.id;
	if (productId == null) {
		return <BannerBlock content={t('banner.error.productIdMissing')} tone="critical" />;
	}

	const shopLocalesResult = await getShopLocales();
	if (shopLocalesResult.isErr()) {
		return (
			<BannerBlock
				content={t('banner.error.metafieldsRead', {
					errorMessage: shopLocalesResult.error.message
				})}
				tone="critical"
			/>
		);
	}
	const primaryLocale =
		shopLocalesResult.value.shopLocales.find((local) => local.primary)?.locale.toUpperCase() ??
		'EN';

	const energyLabelResult = await getEnergyLabelFormMetafields(productId);
	if (energyLabelResult.isErr()) {
		return (
			<BannerBlock
				content={t('banner.error.metafieldsRead', {
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
			<Extension productId={productId} primaryLocale={primaryLocale} />
		</QueryClientProvider>
	);
});

const Extension: React.FC<TProps> = (props) => {
	const { productId, primaryLocale } = props;
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
					<UpdateEnergyLabelMetaFieldsBlock
						productId={productId}
						energyLabel={energyLabel}
						primaryLocale={primaryLocale}
					/>
				) : (
					<LoadEnergyLabelBlock productId={productId} />
				)}
			</BlockStack>
		</AdminBlock>
	);
};

interface TProps {
	productId: string;
	primaryLocale: string;
}
