import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode
} from 'feature-form';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { t } from '../../environment';
import { TEnergyLabel, updateEnergyLabelInMetafields } from '../services';
import { $banner, $energyLabel } from '../store';

export const UPDATE_ENERGY_LABEL_METAFIELD_FORM_SOURCE_KEY = 'UPDATE_ENERGY_LABEL_METAFIELD_FORM';

export const $updateEnergyLabelMetafieldForm = createForm<TFormFields>({
	fields: {
		registrationNumber: {
			validator: vValidator(
				v.pipe(
					v.string(),
					v.regex(/^\d{6}$/, () => t('validation.registrationNumber.format'))
				)
			),
			defaultValue: ''
		},
		modelIdentifier: {
			validator: vValidator(
				v.pipe(
					v.string(),
					v.minLength(1, () => t('validation.modelIdentifier.required'))
				)
			),
			defaultValue: ''
		},
		energyClass: {
			validator: vValidator(
				v.picklist(['A', 'B', 'C', 'D', 'E', 'F'], () => t('validation.energyClass.invalid'))
			)
		},
		pdfLabelUrl: {
			validator: vValidator(
				v.pipe(
					v.string(),
					v.url(() => t('validation.labelUrl.invalidFormat')),
					v.custom(
						(url) => typeof url === 'string' && url.endsWith('.pdf'),
						() => t('validation.labelUrl.mustEndWithPdf')
					)
				)
			)
		}
	},
	validateMode: bitwiseFlag(FormFieldValidateMode.OnSubmit),
	reValidateMode: bitwiseFlag(FormFieldReValidateMode.OnBlur, FormFieldReValidateMode.OnChange),
	onValidSubmit: async (formData, additionalData = {}) => {
		const { productId } =
			additionalData as unknown as TUpdateEnergyLabelMetafieldSubmitAdditionalData; // TODO: Make more typesafe

		const energyLabel = $energyLabel.get();
		if (energyLabel == null) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.metafieldsWrite', {
					errorMessage: 'Failed to fetch Energy Label metafields'
				}),
				source: UPDATE_ENERGY_LABEL_METAFIELD_FORM_SOURCE_KEY
			});
			return;
		}

		const newEnergyLabel: TEnergyLabel = {
			...energyLabel,
			energyClass: formData.energyClass,
			labelUrlMap: {
				...energyLabel.labelUrlMap,
				PDF: formData.pdfLabelUrl
			}
		};

		const updateEnergyLabelResult = await updateEnergyLabelInMetafields(productId, newEnergyLabel);
		if (updateEnergyLabelResult.isErr()) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.metafieldsWrite', {
					errorMessage: updateEnergyLabelResult.error.message
				}),
				source: UPDATE_ENERGY_LABEL_METAFIELD_FORM_SOURCE_KEY
			});
			return;
		}
		if (updateEnergyLabelResult.value.metafieldsSet.userErrors.length > 0) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.metafieldsWrite', {
					errorMessage:
						updateEnergyLabelResult.value.metafieldsSet.userErrors[0]?.message ?? 'Unknown'
				}),
				source: UPDATE_ENERGY_LABEL_METAFIELD_FORM_SOURCE_KEY
			});
			return;
		}

		$banner.set({
			tone: 'success',
			content: t('banner.success.energyLabelUpdated', {
				productName: energyLabel.modelIdentifier
			}),
			source: UPDATE_ENERGY_LABEL_METAFIELD_FORM_SOURCE_KEY
		});
		$energyLabel.set(newEnergyLabel);
	}
});

interface TFormFields {
	registrationNumber: string;
	modelIdentifier: string;
	energyClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
	pdfLabelUrl: string;
}

export interface TUpdateEnergyLabelMetafieldSubmitAdditionalData {
	productId: string;
}

export function applyEnergyLabelToUpdateMetafieldForm(energyLabel: TEnergyLabel) {
	$updateEnergyLabelMetafieldForm.fields.registrationNumber.set(energyLabel.registrationNumber);
	$updateEnergyLabelMetafieldForm.fields.registrationNumber._intialValue =
		energyLabel.registrationNumber;
	$updateEnergyLabelMetafieldForm.fields.modelIdentifier.set(energyLabel.modelIdentifier);
	$updateEnergyLabelMetafieldForm.fields.modelIdentifier._intialValue = energyLabel.modelIdentifier;
	$updateEnergyLabelMetafieldForm.fields.energyClass.set(energyLabel.energyClass as any);
	$updateEnergyLabelMetafieldForm.fields.energyClass._intialValue = energyLabel.energyClass as any;
	$updateEnergyLabelMetafieldForm.fields.pdfLabelUrl.set(energyLabel.labelUrlMap.PDF);
	$updateEnergyLabelMetafieldForm.fields.pdfLabelUrl._intialValue = energyLabel.labelUrlMap.PDF;
}
