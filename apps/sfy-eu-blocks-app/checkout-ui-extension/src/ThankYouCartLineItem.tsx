import { reactExtension, Text, useCartLineTarget } from '@shopify/ui-extensions-react/checkout';

export default reactExtension('purchase.thank-you.cart-line-item.render-after', () => (
	<Extension />
));

function Extension() {
	const {
		merchandise: { title }
	} = useCartLineTarget();
	return <Text>Thank You - Line item title: {title}</Text>;
}
