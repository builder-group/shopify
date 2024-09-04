import { gql } from 'feature-fetch';

import { q } from '../../environment';

export async function deleteMetafieldMutation(variables: TDeleteMetafieldMutationVariables) {
	return await q<TDeleteMetafieldMutationVariables, TDeleteMetafieldMutationResponseData>(
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
