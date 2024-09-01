import {
	AdminBlock,
	Banner,
	BlockStack,
	Button,
	Form,
	Paragraph,
	ProgressIndicator,
	Section
} from '@shopify/ui-extensions-react/admin';
import { TFormField } from 'feature-form';
import { useForm } from 'feature-react/form';
import { useGlobalState } from 'feature-react/state';
import React from 'react';

import { $energyLabelMetaFieldsForm, t, TEnergyLabel } from '../lib';
import { FormTextField } from './FormTextField';

export const UpdateEnergyLabelMetaFieldsBlock: React.FC<TProps> = (props) => {
	const { energyLabel, successMessage } = props;
	const { handleSubmit, field } = useForm($energyLabelMetaFieldsForm);
	const isSubmitting = useGlobalState($energyLabelMetaFieldsForm.isSubmitting);
	const [submitError, setSubmitError] = React.useState<string | null>(null);

	return (
		<AdminBlock title={t('title')}>
			<BlockStack gap={true}>
				{successMessage != null && (
					<Banner tone={'success'} dismissible>
						<Paragraph>{successMessage}</Paragraph>
					</Banner>
				)}

				<Form
					onReset={() => {
						// TODO
					}}
					onSubmit={() => {
						// TODO
					}}
				>
					<Section heading="Metafields">
						<BlockStack gap={true}>
							<FormTextField
								label="Registration Number"
								field={field('registrationNumber')}
								disabled={isSubmitting}
							/>
							<FormTextField
								label="Model Identifier"
								field={field('modelIdentifier')}
								disabled={isSubmitting}
							/>
							<FormTextField
								label="Energy Class"
								field={field('energyClass') as TFormField<string>}
								disabled={isSubmitting}
							/>
							<FormTextField
								label="PDF Label URL"
								field={field('pdfLabelUrl')}
								disabled={isSubmitting}
							/>
						</BlockStack>
					</Section>
				</Form>
				<Button
					onClick={handleSubmit({
						additionalData: {
							setSubmitError
						}
					})}
				>
					{isSubmitting ? <ProgressIndicator size="small-200" /> : 'Save'}
				</Button>
			</BlockStack>
		</AdminBlock>
	);
};

interface TProps {
	energyLabel: TEnergyLabel;
	successMessage?: string;
}