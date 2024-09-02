import { gql } from 'feature-fetch';

import { shopifyQuery } from '../clients';

export async function deleteMetafieldMutation(variables: TDeleteMetafieldMutationVariables) {
	return await shopifyQuery<
		TDeleteMetafieldMutationVariables,
		TDeleteMetafieldMutationResponseData
	>(
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
