import { TextField } from '@shopify/ui-extensions-react/admin';
import { TFormField } from 'feature-form';
import { useGlobalState } from 'feature-react/state';

export const FormTextField: React.FC<TProps> = (props) => {
	const { field, label, disabled, placeholder } = props;
	const fieldStatus = useGlobalState(field.status);

	return (
		<TextField
			label={label}
			name={field.key}
			defaultValue={field._intialValue}
			onBlur={() => {
				field.blur();
			}}
			onInput={(value) => {
				field.set(value, {
					additionalData: {
						background: true
					}
				});
			}}
			error={fieldStatus.type === 'INVALID' ? fieldStatus.errors[0]?.message : undefined}
			disabled={disabled}
			placeholder={placeholder}
		/>
	);
};

interface TProps {
	label: string;
	field: TFormField<string>;
	disabled?: boolean;
	placeholder?: string;
}
