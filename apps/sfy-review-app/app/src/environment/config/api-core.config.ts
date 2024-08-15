import { assertValue } from '@blgc/utils';

export const apiCoreConfig = {
	baseUrl: assertValue(
		process.env.API_CORE_BASE_URL,
		'Environment variable "API_CORE_BASE_URL" not set!'
	),
	shopifyBearerToken: assertValue(
		process.env.API_CORE_SHOPIFY_BEARER_TOKEN,
		'Environment variable "API_CORE_SHOPIFY_BEARER_TOKEN" not set!'
	)
};
