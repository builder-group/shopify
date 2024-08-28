import { ApiCoreSessionStorage } from '@repo/sfy-app-session-storage-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07';

import '@shopify/shopify-app-remix/adapters/node';

import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';

import { appConfig, coreApiConfig, shopifyConfig } from './environment';

export const apiCoreSessionStorage = new ApiCoreSessionStorage(
	coreApiConfig.shopify.baseUrl,
	coreApiConfig.shopify.bearerToken,
	appConfig.name
);

const shopify = shopifyApp({
	apiKey: shopifyConfig.apiKey,
	apiSecretKey: shopifyConfig.apiSecret,
	apiVersion: ApiVersion.July24,
	scopes: shopifyConfig.scopes,
	appUrl: shopifyConfig.appUrl,
	authPathPrefix: '/auth',
	sessionStorage: apiCoreSessionStorage,
	distribution: AppDistribution.AppStore,
	restResources,
	future: {
		unstable_newEmbeddedAuthStrategy: true
	},
	...(shopifyConfig.shopCustomDomain != null
		? { customShopDomains: [shopifyConfig.shopCustomDomain] }
		: {})
});

export default shopify;
export const apiVersion = ApiVersion.July24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
