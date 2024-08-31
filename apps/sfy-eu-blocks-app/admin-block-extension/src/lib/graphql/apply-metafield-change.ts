import { gql } from 'feature-fetch';

import { shopifyAdminClient } from '../clients';

export async function applyMetafieldChange(variables: TUpdateMetaFieldVariables) {
	return await shopifyAdminClient.query<
		TUpdateMetaFieldVariables,
		{
			metafieldDefinitionCreate: {
				createdDefinition: {
					id: string;
				};
			};
			metafieldsSet: {
				userErrors: {
					field: string;
					message: string;
					code: string;
				}[];
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
				metafieldDefinitionCreate(
					definition: {
						namespace: $namespace
						key: $key
						name: $name
						ownerType: $ownerType
						type: $type
						access: { admin: MERCHANT_READ_WRITE }
					}
				) {
					createdDefinition {
						id
					}
				}
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
