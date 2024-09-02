import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode
} from 'feature-form';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { t } from '../i18n';
import { fetchEnergyLabel, TEnergyLabel, updateEnergyLabelInMetafields } from '../services';

export const $searchEnergyLabelForm = createForm<TFormFields>({
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
		const { setSubmitError, onEnergyLabelSubmit, productId } =
			additionalData as unknown as TValidSubmitAdditionalData; // TODO: Make more typesafe

		setSubmitError(null);

		const energyLabelResult = await fetchEnergyLabel(formData.registrationNumber);
		if (energyLabelResult.isErr()) {
			setSubmitError(
				t('banner.error.retrievalFailed', { errorMessage: energyLabelResult.error.message })
			);
			return;
		}

		const energyLabel = energyLabelResult.value;
		if (energyLabel == null) {
			setSubmitError(
				t('banner.error.notFound', { registrationNumber: formData.registrationNumber })
			);
			return;
		}

		const updateEnergyLabelResult = await updateEnergyLabelInMetafields(productId, energyLabel);
		if (updateEnergyLabelResult.isErr()) {
			setSubmitError(
				t('banner.error.metadataWriteError', {
					errorMessage: updateEnergyLabelResult.error.message
				})
			);
			return;
		}
		if (updateEnergyLabelResult.value.metafieldsSet.userErrors.length > 0) {
			setSubmitError(
				t('banner.error.metadataWriteError', {
					errorMessage:
						updateEnergyLabelResult.value.metafieldsSet.userErrors[0]?.message ?? 'Unknown'
				})
			);
			return;
		}

		onEnergyLabelSubmit(energyLabel);
	}
});

interface TFormFields {
	registrationNumber: string;
}

export interface TValidSubmitAdditionalData {
	productId: string;
	setSubmitError: (error: string | null) => void;
	onEnergyLabelSubmit: (energyLabel: TEnergyLabel) => void;
}
