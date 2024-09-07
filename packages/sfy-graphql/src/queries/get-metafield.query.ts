import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export function getMetafieldQuery(
	variables: TGetMetafieldQueryVariables,
	query: TQuery
): Promise<TResult<TGetMetafieldQueryResponseData, FetchError>> {
	return query<TGetMetafieldQueryVariables, TGetMetafieldQueryResponseData>(
		gql`
			query GetMetafield($productId: ID!, $namespace: String!, $key: String!) {
				product(id: $productId) {
					metafield(namespace: $namespace, key: $key) {
						value
					}
				}
			}
		`,
		variables
	);
}

export interface TGetMetafieldQueryVariables {
	productId: string;
	namespace: string;
	key: string;
}

export interface TGetMetafieldQueryResponseData {
	product: {
		metafield: {
			value: string;
		} | null;
	};
}
