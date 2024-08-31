import { createGraphQLFetchClient } from 'feature-fetch';

import { shopifyConfig } from '../../environment';

export const shopifyAdminClient = createGraphQLFetchClient({
	prefixUrl: shopifyConfig.graphqlUrl
});
