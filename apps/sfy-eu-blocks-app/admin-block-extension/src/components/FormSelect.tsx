import {
	OptionDescription,
	OptionGroupDescription,
	Select
} from '@shopify/ui-extensions-react/admin';
import { TFormField } from 'feature-form';
import { useGlobalState } from 'feature-react/state';

export const FormSelect: React.FC<TProps> = (props) => {
	const { field, label, options, disabled, placeholder } = props;
	const fieldStatus = useGlobalState(field.status);
	const fieldValue = useGlobalState(field);

	return (
		<Select
			label={label}
			name={field.key}
			onBlur={() => {
				field.blur();
			}}
			value={fieldValue}
			options={options}
			onChange={(value) => {
				field.set(value, {
					additionalData: {
						background: false // Because its controlled form field
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
	options: (OptionDescription | OptionGroupDescription)[];
	disabled?: boolean;
	placeholder?: string;
}
