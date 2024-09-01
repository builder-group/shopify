import { gql } from 'feature-fetch';

import { shopifyAdminClient } from '../clients';

export async function getMetafield(variables: TGetMetafieldVariables) {
	return await shopifyAdminClient.query<
		TGetMetafieldVariables,
		{
			data: {
				product: {
					metafield: {
						value: string;
					} | null;
				};
			};
		}
	>(
		gql`
			query GetMetafield($id: ID!, $namespace: String!, $key: String!) {
				product(id: $id) {
					metafield(namespace: $namespace, key: $key) {
						value
					}
				}
			}
		`,
		{ variables }
	);
}

export interface TGetMetafieldVariables {
	id: string; // ownerId
	namespace: string;
	key: string;
}
