import {
	AdminBlock,
	Banner,
	BlockStack,
	Button,
	InlineStack,
	Paragraph,
	ProgressIndicator,
	Section
} from '@shopify/ui-extensions-react/admin';
import { hasFormChanged, TFormField } from 'feature-form';
import { useForm } from 'feature-react/form';
import { useGlobalState } from 'feature-react/state';
import React from 'react';
import { useMutation } from 'react-query';

import {
	$energyLabelMetaFieldsForm,
	deleteEnergyLabelFromMetafields,
	t,
	TEnergyLabel
} from '../lib';
import { FormTextField } from './FormTextField';

export const UpdateEnergyLabelMetaFieldsBlock: React.FC<TProps> = (props) => {
	const { energyLabel, successMessage, productId } = props;
	const { handleSubmit, field } = useForm($energyLabelMetaFieldsForm);
	const isSubmitting = useGlobalState($energyLabelMetaFieldsForm.isSubmitting);
	const [submitError, setSubmitError] = React.useState<string | null>(null);

	const resetMutation = useMutation<any, any, { productId: string }>({
		mutationFn: async (data) => {
			(await deleteEnergyLabelFromMetafields(data.productId)).unwrap();
		}
	});

	return (
		<AdminBlock title={t('title')}>
			<BlockStack gap={true}>
				{successMessage != null && (
					<Banner tone={'success'} dismissible>
						<Paragraph>{successMessage}</Paragraph>
					</Banner>
				)}

				<Section heading="Metafields">
					<BlockStack gap={true}>
						{/* <Form
							id="form"
							onReset={() => {
								// TODO
							}}
							onSubmit={() => {
								// TODO
							}}
						> */}
						<InlineStack gap>
							<FormTextField
								label="Registration Number"
								field={field('registrationNumber')}
								disabled={true}
							/>
							<FormTextField
								label="Model Identifier"
								field={field('modelIdentifier')}
								disabled={true}
							/>

							<FormTextField
								label="Energy Class"
								field={field('energyClass') as TFormField<string>}
								disabled={isSubmitting}
							/>
						</InlineStack>
						<FormTextField
							label="PDF Label URL"
							field={field('pdfLabelUrl')}
							disabled={isSubmitting}
						/>
						{/* </Form> */}
					</BlockStack>
				</Section>

				<InlineStack gap>
					<Button
						onClick={handleSubmit({
							additionalData: {
								setSubmitError
							}
						})}
						disabled={isSubmitting || !hasFormChanged($energyLabelMetaFieldsForm)}
					>
						{isSubmitting ? <ProgressIndicator size="small-200" /> : 'Save'}
					</Button>
					<Button
						onClick={() => {
							resetMutation.mutate({ productId });
						}}
					>
						{resetMutation.isLoading ? <ProgressIndicator size="small-200" /> : 'Reset'}
					</Button>
				</InlineStack>
			</BlockStack>
		</AdminBlock>
	);
};

interface TProps {
	productId: string;
	energyLabel: TEnergyLabel;
	successMessage?: string;
}
