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
			query GetMetafield($ownerId: ID!, $namespace: String!, $key: String!) {
				product(id: $ownerId) {
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
	ownerId: string;
	namespace: string;
	key: string;
}
