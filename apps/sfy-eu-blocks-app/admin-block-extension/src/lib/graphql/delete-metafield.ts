import { gql } from 'feature-fetch';

import { shopifyAdminClient } from '../clients';

export async function deleteMetafield(variables: TDeleteMetafieldVariables) {
	return await shopifyAdminClient.query<
		TDeleteMetafieldVariables,
		{
			data: {
				metafieldsDelete: {
					userErrors: {
						field: string[];
						message: string;
					}[];
				};
			};
		}
	>(
		gql`
			mutation DeleteMetafield($namespace: String!, $ownerId: ID!, $key: String!) {
				# // https://shopify.dev/docs/api/admin-graphql/unstable/mutations/metafieldsDelete
				metafieldsDelete(metafields: [{ ownerId: $ownerId, namespace: $namespace, key: $key }]) {
					userErrors {
						field
						message
					}
				}
			}
		`,
		{ variables }
	);
}

export interface TDeleteMetafieldVariables {
	key: string;
	namespace: string;
	ownerId: string;
}
