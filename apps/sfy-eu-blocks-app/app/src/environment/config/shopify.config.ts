import { assertValue } from '@blgc/utils';

export const shopifyConfig = {
	apiKey: assertValue(
		process.env.SHOPIFY_API_KEY,
		'Environment variable "SHOPIFY_API_KEY" not set!'
	),
	apiSecret: assertValue(
		process.env.SHOPIFY_API_SECRET,
		'Environment variable "SHOPIFY_API_SECRET" not set!'
	),
	appUrl: assertValue(
		process.env.SHOPIFY_APP_URL,
		'Environment variable "SHOPIFY_APP_URL" not set!'
	),
	scopes: typeof process.env.SCOPES === 'string' ? process.env.SCOPES.split(',') : [],
	shopCustomDomain: process.env.SHOP_CUSTOM_DOMAIN
};
