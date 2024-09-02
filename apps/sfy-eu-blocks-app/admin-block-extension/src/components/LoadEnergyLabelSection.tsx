import {
	Banner,
	BlockStack,
	Button,
	Paragraph,
	ProgressIndicator
} from '@shopify/ui-extensions-react/admin';
import { useForm } from 'feature-react/form';
import { useGlobalState } from 'feature-react/state';
import React from 'react';

import { $loadEnergyLabelForm, SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY, t } from '../lib';
import { $banner } from '../lib/store';
import { FormTextField } from './FormTextField';

export const LoadEnergyLabelBlock: React.FC<TProps> = (props) => {
	const { productId } = props;
	const { handleSubmit, field } = useForm($loadEnergyLabelForm);
	const isSubmitting = useGlobalState($loadEnergyLabelForm.isSubmitting);

	// If form submit emits error and thus error banner is shown,
	// reset form errors to not overwhelm user with errors
	React.useEffect(() => {
		const banner = $banner.get();
		if (
			!isSubmitting &&
			banner?.source === SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY &&
			banner.tone === 'critical'
		) {
			$loadEnergyLabelForm.isSubmitted.set(false);
			$loadEnergyLabelForm.isSubmitting.set(false);
			$loadEnergyLabelForm.fields.registrationNumber.isSubmitted = false;
			$loadEnergyLabelForm.fields.registrationNumber.isSubmitting = false;
		}
	}, [isSubmitting, $banner]);

	return (
		<BlockStack gap={true}>
			<FormTextField
				label="Registration Number"
				field={field('registrationNumber')}
				disabled={isSubmitting}
				placeholder={'550826'}
			/>
			<Button
				onClick={handleSubmit({
					additionalData: {
						productId
					}
				})}
			>
				{isSubmitting ? <ProgressIndicator size="small-200" /> : 'Load Energy Label'}
			</Button>
			<Banner tone="info" title={t('banner.eprelHelp.title')}>
				<Paragraph>{t('banner.eprelHelp.content')}</Paragraph>
			</Banner>
		</BlockStack>
	);
};

interface TProps {
	productId: string;
}
