import '@shopify/shopify-app-remix/adapters/node';

import { LocalSessionStorage } from '@repo/shopify-app-session-storage-local';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07';
import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';

export const localSessionStorage = new LocalSessionStorage();

const shopify = shopifyApp({
	apiKey: process.env.SHOPIFY_API_KEY,
	apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
	apiVersion: ApiVersion.July24,
	scopes: process.env.SCOPES?.split(','),
	appUrl: process.env.SHOPIFY_APP_URL || '',
	authPathPrefix: '/auth',
	sessionStorage: localSessionStorage,
	distribution: AppDistribution.AppStore,
	restResources,
	future: {
		unstable_newEmbeddedAuthStrategy: true
	},
	...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {})
});

export default shopify;
export const apiVersion = ApiVersion.July24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
