import { gql } from 'feature-fetch';

import { q } from '../../environment';

export async function updateMetafieldMutation(variables: TUpdateMetafieldVariables) {
	return await q<TUpdateMetafieldVariables, TUpdateMetafieldResponseData>(
		gql`
			mutation UpdateMetafield(
				$productId: ID!
				$namespace: String!
				$key: String!
				$type: String!
				$value: String!
				$namespaceName: String!
			) {
				metafieldDefinitionCreate(
					definition: {
						namespace: $namespace
						key: $key
						name: $namespaceName
						type: $type
						ownerType: PRODUCT
						access: { admin: MERCHANT_READ, storefront: PUBLIC_READ }
					}
				) {
					createdDefinition {
						id
					}
				}
				metafieldsSet(
					metafields: [
						{ ownerId: $productId, namespace: $namespace, key: $key, type: $type, value: $value }
					]
				) {
					userErrors {
						field
						message
						code
					}
				}
			}
		`,
		variables
	);
}

export interface TUpdateMetafieldVariables {
	productId: string;
	namespace: string;
	key: string;
	type: string;
	value: string;
	namespaceName: string;
}

export interface TUpdateMetafieldResponseData {
	metafieldDefinitionCreate: {
		createdDefinition: {
			id: string;
		} | null;
	};
	metafieldsSet: {
		userErrors: {
			field: string[];
			message: string;
			code: string;
		}[];
	};
}
