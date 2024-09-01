import { AdminBlock, Banner, Paragraph } from '@shopify/ui-extensions-react/admin';
import React from 'react';

import { t } from '../lib';

export const BannerBlock: React.FC<TProps> = (props) => {
	const { title, tone = 'default', content } = props;

	return (
		<AdminBlock title={t('title')}>
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
