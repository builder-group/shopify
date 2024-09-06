import {
	Banner,
	BlockStack,
	Image,
	InlineStack,
	Link,
	Paragraph,
	Pressable
} from '@shopify/ui-extensions-react/admin';
import React from 'react';

import { coreApiConfig, t } from '../environment';
import { TEnergyLabel } from '../lib';

export const EnergyLabelPreview: React.FC<TProps> = (props) => {
	const { energyLabel, language } = props;
	const sheetUrl = React.useMemo(
		() => (energyLabel.sheet.urlMap as Record<string, string>)[language],
		[energyLabel.sheet.urlMap, language]
	);

	return (
		<BlockStack gap>
			<InlineStack gap>
				<Pressable href={energyLabel.label.urlMap.PDF} target="_blank">
					<Image
						alt={`Energy Label Efficiency Class ${energyLabel.energyClass}`}
						source={`${coreApiConfig.baseUrl}/v1/energy-label/energy-class/arrow.svg?energyClass=${energyLabel.energyClass}&size=26`}
					/>
				</Pressable>
				<Link href={sheetUrl} target="_blank">
					Product Datasheet
				</Link>
			</InlineStack>
			{sheetUrl == null && (
				<Banner title={t('banner.warning.noDatasheetForLanguage.title')} tone="warning">
					<Paragraph>{t('banner.warning.noDatasheetForLanguage.content', { language })}</Paragraph>
				</Banner>
			)}
		</BlockStack>
	);
};

interface TProps {
	energyLabel: TEnergyLabel;
	language: string;
}
