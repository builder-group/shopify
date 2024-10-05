import { assertValue } from '@blgc/utils';

const baseUrl = assertValue(
	process.env.API_CORE_BASE_URL,
	'Environment variable "API_CORE_BASE_URL" not set!'
).replace(/\/$/, '');

export const coreApiConfig = {
	baseUrl,
	shopify: {
		baseUrl: `${baseUrl}/v1/shopify`,
		bearerToken: assertValue(
			process.env.API_CORE_SHOPIFY_BEARER_TOKEN,
			'Environment variable "API_CORE_SHOPIFY_BEARER_TOKEN" not set!'
		)
	}
};
