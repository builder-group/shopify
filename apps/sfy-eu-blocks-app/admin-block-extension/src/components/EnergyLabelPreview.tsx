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
	const { energyLabel, primaryLocale } = props;
	const sheetUrl = React.useMemo(
		() => (energyLabel.sheetUrlMap as Record<string, string>)[primaryLocale],
		[energyLabel.sheetUrlMap, primaryLocale]
	);

	return (
		<BlockStack gap>
			<InlineStack gap>
				<Pressable href={energyLabel.labelUrlMap.PDF} target="_blank">
					<Image
						alt={`Energy Label Efficiency Class ${energyLabel.energyClass}`}
						source={`${coreApiConfig.baseUrl}/v1/energy-label/efficiency-class/arrow.svg?efficiencyClass=${energyLabel.energyClass}&size=26`}
					/>
				</Pressable>
				<Link href={sheetUrl} target="_blank">
					Product Datasheet
				</Link>
			</InlineStack>
			{sheetUrl == null && (
				<Banner title={t('banner.warning.noDatasheetForLocale.title')} tone="warning">
					<Paragraph>
						{t('banner.warning.noDatasheetForLocale.content', { locale: primaryLocale })}
					</Paragraph>
				</Banner>
			)}
		</BlockStack>
	);
};

interface TProps {
	energyLabel: TEnergyLabel;
	primaryLocale: string;
}
