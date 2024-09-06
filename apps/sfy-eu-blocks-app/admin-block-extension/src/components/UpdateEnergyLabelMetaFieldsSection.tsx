import {
	Banner,
	BlockStack,
	Box,
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

import { t } from '../environment';
import {
	$banner,
	$energyLabel,
	$updateEnergyLabelMetafieldForm,
	deleteEnergyLabelFromMetafields,
	TEnergyLabel
} from '../lib';
import { EnergyLabelPreview } from './EnergyLabelPreview';
import { FormSelect } from './FormSelect';
import { FormTextField } from './FormTextField';

export const UpdateEnergyLabelMetaFieldsBlock: React.FC<TProps> = (props) => {
	const { productId, energyLabel, locale } = props;
	const { handleSubmit, field } = useForm($updateEnergyLabelMetafieldForm);
	const isSubmitting = useGlobalState($updateEnergyLabelMetafieldForm.isSubmitting);
	const [formChanged, setFormChanged] = React.useState(false);

	// gid:/shopify/Product/9436272754952 -> 9436272754952
	const productIdNumber = React.useMemo(() => productId.replace(/^(.*[\\\/])/, ''), [productId]);

	React.useEffect(() => {
		$updateEnergyLabelMetafieldForm.fields.energyClass.listen(() => {
			setFormChanged(hasFormChanged($updateEnergyLabelMetafieldForm));
		});
		$updateEnergyLabelMetafieldForm.fields.pdfLabelUrl.listen(() => {
			setFormChanged(hasFormChanged($updateEnergyLabelMetafieldForm));
		});
		$updateEnergyLabelMetafieldForm.fields.fallbackSheetLanguage.listen(() => {
			setFormChanged(hasFormChanged($updateEnergyLabelMetafieldForm));
		});
	}, [$updateEnergyLabelMetafieldForm]);

	const resetMutation = useMutation<any, any, { productId: string }>({
		mutationFn: async (data) => {
			const result = await deleteEnergyLabelFromMetafields(data.productId);
			if (result.isErr()) {
				throw result.error;
			}
			$banner.set({
				tone: 'success',
				content: t('banner.success.energyLabelReset'),
				source: 'RESET_METAFIELD'
			});
			$energyLabel.set(null);
		}
	});

	return (
		<BlockStack gap={true}>
			<Section heading={t('section.metafields')}>
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
							label={t('label.registrationNumber')}
							field={field('registrationNumber')}
							disabled={true}
						/>
						{/* <FormTextField
							label={t('label.modelIdentifier')}
							field={field('modelIdentifier')}
							disabled={true}
						/> */}
						<FormTextField
							label={t('label.energyClass')}
							field={field('energyClass') as TFormField<string>}
							disabled={isSubmitting}
						/>
					</InlineStack>
					<InlineStack gap>
						<FormTextField
							label={t('label.pdfLabelUrl')}
							field={field('pdfLabelUrl')}
							disabled={isSubmitting}
						/>
						<FormSelect
							label={t('label.sheetFallbackLanguage')}
							field={field('fallbackSheetLanguage') as TFormField<string>}
							options={Object.keys(energyLabel.sheet.urlMap).map((language) => ({
								value: language,
								label: language
							}))}
						/>
					</InlineStack>

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
				<Button
					variant="tertiary"
					target="_blank"
					href={`app://eu-blocks/energy-label/${productIdNumber}`}
				>
					{t('button.editAdditionalMetafields')}
				</Button>
			</InlineStack>

			<Box padding="base" />

			<Section heading={t('section.preview', { language: locale })}>
				<EnergyLabelPreview
					energyLabel={energyLabel}
					language={
						locale in energyLabel.sheet.urlMap ? locale : energyLabel.sheet.fallbackLanguage
					}
				/>
			</Section>

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
	energyLabel: TEnergyLabel;
	locale: string;
}
