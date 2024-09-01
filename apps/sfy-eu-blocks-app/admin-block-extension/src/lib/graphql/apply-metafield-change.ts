import { gql } from 'feature-fetch';

import { shopifyAdminClient } from '../clients';

export async function applyMetafieldChange(variables: TUpdateMetaFieldVariables) {
	return await shopifyAdminClient.query<
		TUpdateMetaFieldVariables,
		{
			data: {
				metafieldDefinitionCreate: {
					createdDefinition: {
						id: string;
					};
					userErrors: {
						field: string;
						message: string;
						code: string;
					}[];
				};
				metafieldsSet: {
					userErrors: {
						field: string;
						message: string;
						code: string;
					}[];
				};
			};
		}
	>(
		gql`
			mutation SetMetafield(
				$namespace: String!
				$ownerId: ID!
				$key: String!
				$type: String!
				$value: String!
				$name: String!
				$ownerType: MetafieldOwnerType!
			) {
				# https://shopify.dev/docs/api/admin-graphql/unstable/mutations/metafieldDefinitionCreate
				metafieldDefinitionCreate(
					definition: {
						name: $name
						namespace: $namespace
						key: $key
						type: $type
						ownerType: $ownerType
						access: { admin: MERCHANT_READ_WRITE }
					}
				) {
					createdDefinition {
						id
					}
					# No errors since we expect an error if it already exists, otherwise we would require two requests
					# userErrors {
					# 	field
					# 	message
					# 	code
					# }
				}
				# https://shopify.dev/docs/api/admin-graphql/unstable/mutations/metafieldsSet
				metafieldsSet(
					metafields: [
						{ ownerId: $ownerId, namespace: $namespace, key: $key, type: $type, value: $value }
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
		{
			variables
		}
	);
}

export interface TUpdateMetaFieldVariables {
	ownerId: string;
	namespace: string;
	key: string;
	type: string;
	value: string;
	name: string;
	ownerType: string;
}
