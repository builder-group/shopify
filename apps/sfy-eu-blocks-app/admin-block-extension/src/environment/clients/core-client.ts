import { createCoreClient, TFetchClient } from '@repo/api-core-client';
import type { coreApiV1 } from '@repo/types/api';

import { coreApiConfig } from '../config';

// Explicitly set TFetchClient type to ensure that TypeScript recognizes and resolves the type correctly
export const coreClient: TFetchClient<['base', 'openapi'], coreApiV1.paths> = createCoreClient({
	prefixUrl: coreApiConfig.baseUrl
});
