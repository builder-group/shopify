import {
	bitwiseFlag,
	createForm,
	FormFieldReValidateMode,
	FormFieldValidateMode
} from 'feature-form';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';

import { t } from '../i18n';

export const $energyLabelMetaFieldsForm = createForm<TFormFields>({
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
					v.url(() => t('validation.labelUrl.invalidFormat'))
				)
			)
		}
	},
	validateMode: bitwiseFlag(FormFieldValidateMode.OnSubmit),
	reValidateMode: bitwiseFlag(FormFieldReValidateMode.OnBlur, FormFieldReValidateMode.OnChange),
	onValidSubmit: async (formData, additionalData = {}) => {
		console.log({ formData, additionalData });
	}
});

interface TFormFields {
	registrationNumber: string;
	modelIdentifier: string;
	energyClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
	pdfLabelUrl: string;
}
