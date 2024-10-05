import { describe, expect, it } from 'vitest';

import { createCoreClient } from './create-core-client';

describe('createGoogleWebfontsClient function tests', () => {
	it('should have correct types', async () => {
		const client = createCoreClient();

		const productGroupsResult = await client.get('/v1/energy-label/product-groups');

		expect(productGroupsResult.isOk()).toBeTruthy();
	});
});
