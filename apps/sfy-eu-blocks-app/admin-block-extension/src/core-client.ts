import { createCoreClient, TFetchClient } from '@repo/api-core-client';
import type { coreApiV1 } from '@repo/types/api';

// Explicitly set TFetchClient type to ensure that TypeScript recognizes and resolves the type correctly
export const coreClient: TFetchClient<['base', 'openapi'], coreApiV1.paths> = createCoreClient({
	prefixUrl: 'https://seeking-cottages-delta-karl.trycloudflare.com' // TODO: Find way to sync url from api-core-node
});
