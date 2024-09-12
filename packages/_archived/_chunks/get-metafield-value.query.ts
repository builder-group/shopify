import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export function getMetafieldValueQuery(
	variables: TGetMetafieldValueQueryVariables,
	query: TQuery
): Promise<TResult<TGetMetafieldValueQueryResponseData, FetchError>> {
	return query<TGetMetafieldValueQueryResponseData, TGetMetafieldValueQueryVariables>(
		gql`
			query GetMetafieldValue($productId: ID!, $namespace: String!, $key: String!) {
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

export interface TGetMetafieldValueQueryVariables {
	productId: string;
	namespace: string;
	key: string;
}

export interface TGetMetafieldValueQueryResponseData {
	product: {
		metafield: {
			value: string;
		} | null;
	};
}
