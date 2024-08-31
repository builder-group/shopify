import { AdminBlock, Banner, Paragraph, useApi } from '@shopify/ui-extensions-react/admin';
import React from 'react';

import { appConfig } from '../environment';

export const BannerBlock: React.FC<TProps> = (props) => {
	const { title, tone = 'default', content } = props;
	const { i18n } = useApi(appConfig.target);

	return (
		<AdminBlock title={i18n.translate('title')}>
			<Banner title={title} tone={tone}>
				{typeof content === 'string' ? <Paragraph>{content}</Paragraph> : content}
			</Banner>
		</AdminBlock>
	);
};

interface TProps {
	title?: string;
	tone?: 'info' | 'success' | 'warning' | 'critical' | 'default';
	content: React.ReactElement | string;
}
