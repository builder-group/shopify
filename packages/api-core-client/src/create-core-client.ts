import { type coreApiV1 } from '@repo/types/api';
import { createOpenApiFetchClient, type TFetchClient } from 'feature-fetch';

export function createCoreClient(
	options: TCoreClientOptions = {}
): TFetchClient<['base', 'openapi'], coreApiV1.paths> {
	const { prefixUrl = 'http://localhost:8787', shopifyToken } = options;
	return createOpenApiFetchClient<coreApiV1.paths>({
		prefixUrl,
		beforeRequestMiddlewares: [
			(data) => {
				if (shopifyToken != null && data.path.startsWith('/v1/shopify')) {
					data.requestInit.headers.Authorization = [`Bearer ${shopifyToken}`];
				}
			}
		]
	});
}

export interface TCoreClientOptions {
	prefixUrl?: string;
	shopifyToken?: string;
}
