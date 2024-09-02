import { gql } from 'feature-fetch';

import { shopifyQuery } from '../clients';

export async function getMetafieldQuery(variables: TGetMetafieldQueryVariables) {
	return await shopifyQuery<TGetMetafieldQueryVariables, TGetMetafieldQueryResponseData>(
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
