export const appConfig = {
	target: 'admin.product-details.block.render' as const,
	metafields: {
		energyLabel: {
			namespace: '$app:energy_label',
			key: 'energy_label',
			contentType: 'json'
		}
	}
};
