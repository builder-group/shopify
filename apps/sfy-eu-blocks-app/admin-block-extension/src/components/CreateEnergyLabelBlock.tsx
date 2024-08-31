import {
	AdminBlock,
	Banner,
	BlockStack,
	Button,
	Paragraph,
	ProgressIndicator,
	useApi
} from '@shopify/ui-extensions-react/admin';
import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode,
	TValidSubmitCallback
} from 'feature-form';
import { useForm } from 'feature-react/form';
import React from 'react';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { appConfig } from '../environment';
import { fetchEnergyLabel, TEnergyLabel } from '../lib';
import { FormTextField } from './FormTextField';

export const CreateEnergyLabelBlock: React.FC<TProps> = (props) => {
	const { onEnergyLabelSubmit } = props;
	const { i18n } = useApi(appConfig.target);
	const { handleSubmit, field } = useForm($form);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [submitError, setSubmitError] = React.useState<string | null>(null);

	// Reset form submit status to not overwhelm user with errors
	React.useEffect(() => {
		$form.isSubmitted = false;
		$form.isSubmitting = false;
		$form.fields.registrationNumber.isSubmitted = false;
		$form.fields.registrationNumber.isSubmitting = false;
		console.log({ form: $form });
	}, [isSubmitting]);

	const handleValidSubmit: TValidSubmitCallback<{
		registrationNumber: string;
	}> = React.useCallback(async (formData) => {
		setIsSubmitting(true);
		setSubmitError(null);

		const result = await fetchEnergyLabel(formData.registrationNumber);
		if (result.isErr()) {
			setSubmitError(`Failed to retrieve Energy Label by exception: ${result.error.message}`);
			setIsSubmitting(false);
			return;
		}

		const data = result.value;
		if (data == null) {
			setSubmitError(
				`No Energy Label with the registration number ${formData.registrationNumber} found.`
			);
			setIsSubmitting(false);
			return;
		}

		onEnergyLabelSubmit(data);
		setIsSubmitting(false);
	}, []);

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
						onValidSubmit: handleValidSubmit
					})}
				>
					{isSubmitting ? <ProgressIndicator size="small-200" /> : 'Submit'}
				</Button>
			</BlockStack>
		</AdminBlock>
	);
};

interface TProps {
	onEnergyLabelSubmit: (energyLabel: TEnergyLabel) => void;
}

const $form = createForm<{ registrationNumber: string }>({
	fields: {
		registrationNumber: {
			validator: vValidator(
				v.pipe(
					v.string(),
					v.regex(/^\d{6}$/, 'The EPREL registration number must contain exactly 6 digits (0-9).'),
					v.minLength(6, 'The EPREL registration number must be exactly 6 characters long.'),
					v.maxLength(6, 'The EPREL registration number must be exactly 6 characters long.')
				)
			),
			defaultValue: ''
		}
	},
	validateMode: bitwiseFlag(FormFieldValidateMode.OnSubmit),
	reValidateMode: bitwiseFlag(FormFieldReValidateMode.OnBlur, FormFieldReValidateMode.OnChange)
});
