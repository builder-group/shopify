import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export async function deleteMetafieldMutation(
	variables: TDeleteMetafieldMutationVariables,
	query: TQuery
): Promise<TResult<TDeleteMetafieldMutationResponseData, FetchError>> {
	return query<TDeleteMetafieldMutationResponseData, TDeleteMetafieldMutationVariables>(
		gql`
			mutation DeleteMetafield($productId: ID!, $namespace: String!, $key: String!) {
				metafieldsDelete(metafields: [{ ownerId: $productId, namespace: $namespace, key: $key }]) {
					userErrors {
						field
						message
					}
				}
			}
		`,
		variables
	);
}

export interface TDeleteMetafieldMutationVariables {
	key: string;
	namespace: string;
	productId: string;
}

export interface TDeleteMetafieldMutationResponseData {
	metafieldsDelete: {
		userErrors: {
			field: string[];
			message: string;
		}[];
	};
}
