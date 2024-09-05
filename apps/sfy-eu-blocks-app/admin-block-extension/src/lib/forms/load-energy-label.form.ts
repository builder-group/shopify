import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode
} from 'feature-form';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { t } from '../../environment';
import { fetchEnergyLabel, updateEnergyLabelInMetafields } from '../services';
import { $banner, $energyLabel } from '../store';
import { applyEnergyLabelToUpdateMetafieldForm } from './update-energy-label-metafield.form';

export const SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY = 'SEARCH_ENERGY_LABEL_FORM';

export const $loadEnergyLabelForm = createForm<TFormFields>({
	fields: {
		registrationNumber: {
			validator: vValidator(
				v.pipe(
					v.string(),
					v.regex(/^\d{6}$/, () => t('validation.registrationNumber.format'))
				)
			),
			defaultValue: ''
		}
	},
	validateMode: bitwiseFlag(FormFieldValidateMode.OnSubmit),
	reValidateMode: bitwiseFlag(FormFieldReValidateMode.OnBlur, FormFieldReValidateMode.OnChange),
	onValidSubmit: async (formData, additionalData = {}) => {
		const { productId } = additionalData as unknown as TValidLoadEnergyLabelSubmitAdditionalData; // TODO: Make more typesafe

		const energyLabelResult = await fetchEnergyLabel(formData.registrationNumber);
		if (energyLabelResult.isErr()) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.retrievalFailed', {
					errorMessage: energyLabelResult.error.message
				}),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return { success: false };
		}

		const energyLabel = energyLabelResult.value;
		if (energyLabel == null) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.notFound', { registrationNumber: formData.registrationNumber }),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return { success: false };
		}

		const updateEnergyLabelResult = await updateEnergyLabelInMetafields(productId, energyLabel);
		if (updateEnergyLabelResult.isErr()) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.metafieldsWrite', {
					errorMessage: updateEnergyLabelResult.error.message
				}),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return { success: false };
		}
		if (updateEnergyLabelResult.value.metafieldsSet.userErrors.length > 0) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.metafieldsWrite', {
					errorMessage:
						updateEnergyLabelResult.value.metafieldsSet.userErrors[0]?.message ?? 'Unknown'
				}),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return { success: false };
		}

		applyEnergyLabelToUpdateMetafieldForm(energyLabel);

		$banner.set({
			tone: 'success',
			content: t('banner.success.energyLabelFound', {
				productName: energyLabel.modelIdentifier
			}),
			source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
		});
		$energyLabel.set(energyLabel);

		return { success: true };
	}
});

interface TFormFields {
	registrationNumber: string;
}

export interface TValidLoadEnergyLabelSubmitAdditionalData {
	productId: string;
}
