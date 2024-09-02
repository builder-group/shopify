import { createGraphQLFetchClient, Err, FetchError, Ok, TResult } from 'feature-fetch';

import { shopifyConfig } from '../../environment';

export const shopifyAdminClient = createGraphQLFetchClient({
	prefixUrl: shopifyConfig.graphqlUrl
});

export async function shopifyQuery<
	GVariables extends Record<string, any>,
	GSucessResponseData extends Record<string, any>
>(query: string, variables: GVariables): Promise<TResult<GSucessResponseData, FetchError>> {
	const result = await shopifyAdminClient.query<
		GVariables,
		TShopifyQueryResposne<GSucessResponseData>
	>(query, {
		variables
	});

	if (result.isErr()) {
		return Err(result.error);
	}

	const value = result.value;
	if (value.data.data == null) {
		return Err(new FetchError('#ERR_GRAPHQL', { description: value.data.errors?.[0]?.message }));
	}

	return Ok(value.data.data);
}

export type TShopifyQueryResposne<GSuccessResponseData extends Record<string, any>> =
	| TShopifyQuerySuccessResponse<GSuccessResponseData>
	| TShopifyQueryErrorResponse;

export interface TShopifyQuerySuccessResponse<GSuccessResponseData extends Record<string, any>> {
	data: GSuccessResponseData;
	errors: null;
}

export interface TShopifyQueryErrorResponse {
	data: null;
	errors: { message: string }[];
}
