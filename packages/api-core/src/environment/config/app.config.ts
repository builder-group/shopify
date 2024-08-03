import { assertValue } from '@blgc/utils';

export const appConfig = {
	environment: process.env.NODE_ENV ?? 'local',
	port: process.env.APP_PORT ?? 9000,
	packageVersion: process.env.npm_package_version,
	shopifyBearerToken: assertValue(
		process.env.APP_SHOPIFY_BEARER_TOKEN,
		'Environment variable "APP_SHOPIFY_BEARER_TOKEN" not set!'
	)
};
