import {
	Banner,
	BlockStack,
	Button,
	InlineStack,
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
				label={t('label.registrationNumber')}
				field={field('registrationNumber')}
				disabled={isSubmitting}
				placeholder={'550826'}
			/>
			<InlineStack gap>
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
					disabled={isSubmitting}
				>
					{isSubmitting ? <ProgressIndicator size="small-200" /> : t('button.loadEnergyLabel')}
				</Button>
				<Button variant="tertiary" target="_blank" href={`app://energy-label/finder`}>
					{t('button.findEnergyLabel')}
				</Button>
			</InlineStack>
			<Banner tone="info" title={t('banner.info.eprelHelp.title')}>
				<Paragraph>{t('banner.info.eprelHelp.content')}</Paragraph>
			</Banner>
		</BlockStack>
	);
};

interface TProps {
	productId: string;
}
