import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode
} from 'feature-form';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { fetchEnergyLabel, TEnergyLabel } from '../energy-label';

export const $searchEnergyLabelForm = createForm<{ registrationNumber: string }>({
	fields: {
		registrationNumber: {
			validator: vValidator(
				v.pipe(
					v.string(),
					v.regex(/^\d{6}$/, 'The EPREL registration number must contain exactly 6 digits (0-9).'),
					v.minLength(6, 'The EPREL registration number must be exactly 6 characters long.'),
					v.maxLength(6, 'The EPREL registration number must be exactly 6 characters long.')
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
