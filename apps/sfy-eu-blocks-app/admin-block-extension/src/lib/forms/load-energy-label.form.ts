import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode
} from 'feature-form';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { t } from '../i18n';
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
		const { productId } = additionalData as unknown as TValidSubmitAdditionalData; // TODO: Make more typesafe

		const energyLabelResult = await fetchEnergyLabel(formData.registrationNumber);
		if (energyLabelResult.isErr()) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.retrievalFailed', {
					errorMessage: energyLabelResult.error.message
				}),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return;
		}

		const energyLabel = energyLabelResult.value;
		if (energyLabel == null) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.notFound', { registrationNumber: formData.registrationNumber }),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return;
		}

		const updateEnergyLabelResult = await updateEnergyLabelInMetafields(productId, energyLabel);
		if (updateEnergyLabelResult.isErr()) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.metadataWriteError', {
					errorMessage: updateEnergyLabelResult.error.message
				}),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return;
		}
		if (updateEnergyLabelResult.value.metafieldsSet.userErrors.length > 0) {
			$banner.set({
				tone: 'critical',
				content: t('banner.error.metadataWriteError', {
					errorMessage:
						updateEnergyLabelResult.value.metafieldsSet.userErrors[0]?.message ?? 'Unknown'
				}),
				source: SEARCH_ENERGY_LABEL_FORM_SOURCE_KEY
			});
			return;
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
	}
});

interface TFormFields {
	registrationNumber: string;
}

export interface TValidSubmitAdditionalData {
	productId: string;
}
