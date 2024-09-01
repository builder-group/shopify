import {
	AdminBlock,
	Banner,
	BlockStack,
	Button,
	Paragraph,
	ProgressIndicator,
	useApi
} from '@shopify/ui-extensions-react/admin';
import { useForm } from 'feature-react/form';
import { useGlobalState } from 'feature-react/state';
import React from 'react';

import { appConfig } from '../environment';
import { $searchEnergyLabelForm, TEnergyLabel } from '../lib';
import { FormTextField } from './FormTextField';

export const SearchEnergyLabelBlock: React.FC<TProps> = (props) => {
	const { onEnergyLabelSubmit, productId } = props;
	const { i18n, data } = useApi(appConfig.target);
	const { handleSubmit, field } = useForm($searchEnergyLabelForm);
	const isSubmitting = useGlobalState($searchEnergyLabelForm.isSubmitting);
	const [submitError, setSubmitError] = React.useState<string | null>(null);

	// Reset form submit status to not overwhelm user with errors
	React.useEffect(() => {
		if (!isSubmitting && submitError != null) {
			$searchEnergyLabelForm.isSubmitted.set(false);
			$searchEnergyLabelForm.isSubmitting.set(false);
			$searchEnergyLabelForm.fields.registrationNumber.isSubmitted = false;
			$searchEnergyLabelForm.fields.registrationNumber.isSubmitting = false;
		}
	}, [isSubmitting, submitError]);

	return (
		<AdminBlock title={i18n.translate('title')}>
			{submitError != null && (
				<Banner tone="critical" dismissible>
					<Paragraph>{submitError}</Paragraph>
				</Banner>
			)}
			<BlockStack gap={true}>
				<FormTextField
					label="Registration Number"
					field={field('registrationNumber')}
					disabled={isSubmitting}
				/>
				<Button
					onClick={handleSubmit({
						additionalData: {
							productId,
							onEnergyLabelSubmit,
							setSubmitError
						}
					})}
				>
					{isSubmitting ? <ProgressIndicator size="small-200" /> : 'Search'}
				</Button>
			</BlockStack>
		</AdminBlock>
	);
};

interface TProps {
	onEnergyLabelSubmit: (energyLabel: TEnergyLabel) => void;
	productId: string;
}
