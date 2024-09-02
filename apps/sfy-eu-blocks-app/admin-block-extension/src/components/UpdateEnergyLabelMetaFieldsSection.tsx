import {
	BlockStack,
	Button,
	InlineStack,
	ProgressIndicator,
	Section
} from '@shopify/ui-extensions-react/admin';
import { hasFormChanged, TFormField } from 'feature-form';
import { useForm } from 'feature-react/form';
import { useGlobalState } from 'feature-react/state';
import React from 'react';
import { useMutation } from 'react-query';

import {
	$banner,
	$energyLabel,
	$updateEnergyLabelMetafieldForm,
	deleteEnergyLabelFromMetafields
} from '../lib';
import { FormTextField } from './FormTextField';

export const UpdateEnergyLabelMetaFieldsBlock: React.FC<TProps> = (props) => {
	const { productId } = props;
	const { handleSubmit, field } = useForm($updateEnergyLabelMetafieldForm);
	const isSubmitting = useGlobalState($updateEnergyLabelMetafieldForm.isSubmitting);

	const resetMutation = useMutation<any, any, { productId: string }>({
		mutationFn: async (data) => {
			const result = await deleteEnergyLabelFromMetafields(data.productId);
			if (result.isErr()) {
				throw result.error;
			}
			$banner.set({
				tone: 'success',
				content: 'todo',
				source: 'RESET_METAFIELD'
			});
			$energyLabel.set(null);
		}
	});

	return (
		<BlockStack gap={true}>
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
							productId
						}
					})}
					disabled={isSubmitting || !hasFormChanged($updateEnergyLabelMetafieldForm)}
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
	);
};

interface TProps {
	productId: string;
}
