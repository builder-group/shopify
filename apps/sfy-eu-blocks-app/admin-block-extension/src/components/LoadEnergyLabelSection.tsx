import {
	Banner,
	BlockStack,
	Button,
	Paragraph,
	ProgressIndicator
} from '@shopify/ui-extensions-react/admin';
import { resetSubmitted } from 'feature-form';
import { useForm } from 'feature-react/form';
import { useGlobalState } from 'feature-react/state';
import React from 'react';

import { $loadEnergyLabelForm, t } from '../lib';
import { FormTextField } from './FormTextField';

export const LoadEnergyLabelBlock: React.FC<TProps> = (props) => {
	const { productId } = props;
	const { handleSubmit, field } = useForm($loadEnergyLabelForm);
	const isSubmitting = useGlobalState($loadEnergyLabelForm.isSubmitting);

	return (
		<BlockStack gap={true}>
			<FormTextField
				label="Registration Number"
				field={field('registrationNumber')}
				disabled={isSubmitting}
				placeholder={'550826'}
			/>
			<Button
				variant="primary"
				onClick={handleSubmit({
					additionalData: {
						productId
					},
					postSubmitCallback: (form, submitData) => {
						if ('success' in submitData) {
							if (submitData.success === true) {
								form.reset();
							} else {
								resetSubmitted(form);
							}
						}
					}
				})}
			>
				{isSubmitting ? <ProgressIndicator size="small-200" /> : t('button.loadEnergyLabel')}
			</Button>
			<Banner tone="info" title={t('banner.info.eprelHelp.title')}>
				<Paragraph>{t('banner.info.eprelHelp.content')}</Paragraph>
			</Banner>
		</BlockStack>
	);
};

interface TProps {
	productId: string;
}
