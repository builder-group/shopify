import {
	Banner,
	BlockStack,
	Button,
	InlineStack,
	Link,
	Paragraph,
	ProgressIndicator,
	Section
} from '@shopify/ui-extensions-react/admin';
import { hasFormChanged, resetSubmitted, TFormField } from 'feature-form';
import { useForm } from 'feature-react/form';
import { useGlobalState } from 'feature-react/state';
import React from 'react';
import { useMutation } from 'react-query';

import {
	$banner,
	$energyLabel,
	$updateEnergyLabelMetafieldForm,
	deleteEnergyLabelFromMetafields,
	t
} from '../lib';
import { FormTextField } from './FormTextField';

export const UpdateEnergyLabelMetaFieldsBlock: React.FC<TProps> = (props) => {
	const { productId } = props;
	const { handleSubmit, field } = useForm($updateEnergyLabelMetafieldForm);
	const isSubmitting = useGlobalState($updateEnergyLabelMetafieldForm.isSubmitting);
	const [formChanged, setFormChanged] = React.useState(false);

	React.useEffect(() => {
		$updateEnergyLabelMetafieldForm.fields.energyClass.listen(() => {
			setFormChanged(hasFormChanged($updateEnergyLabelMetafieldForm));
		});
		$updateEnergyLabelMetafieldForm.fields.pdfLabelUrl.listen(() => {
			setFormChanged(hasFormChanged($updateEnergyLabelMetafieldForm));
		});
	}, [$updateEnergyLabelMetafieldForm]);

	// To disable save button
	useGlobalState($updateEnergyLabelMetafieldForm.fields.energyClass);
	useGlobalState($updateEnergyLabelMetafieldForm.fields.pdfLabelUrl);

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
					variant="primary"
					onClick={handleSubmit({
						additionalData: {
							productId
						},
						assignToInitial: true,
						postSubmitCallback: (form) => {
							if (form.isValid.get()) {
								resetSubmitted(form);
							}
							setFormChanged(hasFormChanged($updateEnergyLabelMetafieldForm));
						}
					})}
					disabled={isSubmitting || !formChanged}
				>
					{isSubmitting ? <ProgressIndicator size="small-200" /> : t('button.save')}
				</Button>
				<Button
					onClick={() => {
						resetMutation.mutate({ productId });
					}}
				>
					{resetMutation.isLoading ? <ProgressIndicator size="small-200" /> : t('button.reset')}
				</Button>
				<Button variant="tertiary">{t('button.editAdditionalMetafields')}</Button>
			</InlineStack>

			<Banner tone="info">
				<Paragraph>
					{t('banner.info.eprelNotice.content1')}
					<Link href="https://ec.europa.eu/">{t('banner.info.eprelNotice.link1Text')}</Link>
					{t('banner.info.eprelNotice.content2')}
					<Link href="https://creativecommons.org/licenses/by/4.0/">
						{t('banner.info.eprelNotice.link2Text')}
					</Link>
					{t('banner.info.eprelNotice.content3')}
				</Paragraph>
			</Banner>
		</BlockStack>
	);
};

interface TProps {
	productId: string;
}
