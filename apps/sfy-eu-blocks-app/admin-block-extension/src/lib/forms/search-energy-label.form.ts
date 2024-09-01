import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode
} from 'feature-form';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { getExtensionContext } from '../extension-context';
import { fetchEnergyLabel, TEnergyLabel } from '../services/energy-label';

export const $searchEnergyLabelForm = createForm<{ registrationNumber: string }>({
	fields: {
		registrationNumber: {
			validator: vValidator(
				v.pipe(
					v.string(),
					v.regex(/^\d{6}$/, () =>
						getExtensionContext().i18n.translate('eprelRegistrationNumberValidationRegex')
					)
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
				`Failed to retrieve Energy Label by exception: ${energyLabelResult.error.message}`
			);
			return;
		}

		const energyLabel = energyLabelResult.value;
		if (energyLabel == null) {
			setSubmitError(
				`No Energy Label with the registration number ${formData.registrationNumber} found.`
			);
			return;
		}

		// const result = await updateEnergyLabelInMetadata(productId, energyLabel);
		// if(result.isErr()){

		// }

		onEnergyLabelSubmit(energyLabel);
	}
});

export interface TValidSubmitAdditionalData {
	productId: string;
	setSubmitError: (error: string | null) => void;
	onEnergyLabelSubmit: (energyLabel: TEnergyLabel) => void;
}
