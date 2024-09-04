export const appConfig = {
	target: 'purchase.checkout.cart-line-item.render-after' as const,
	metafields: {
		energyLabel: {
			namespace: '$app:energy_label',
			key: 'energy_label',
			contentType: 'json'
		}
	}
};
