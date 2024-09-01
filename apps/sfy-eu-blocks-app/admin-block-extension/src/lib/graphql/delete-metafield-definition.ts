import { gql } from 'feature-fetch';

import { shopifyAdminClient } from '../clients';

export async function deleteMetafieldDefinition(variables: TDeleteMetafieldDefinitionVariables) {
	return await shopifyAdminClient.query<
		TDeleteMetafieldDefinitionVariables,
		{
			data: {
				metafieldDefinitionDelete: {
					deletedDefinitionId: string | null;
					userErrors: {
						field: string[];
						message: string;
						code: string;
					}[];
				};
			};
		}
	>(
		gql`
			mutation DeleteMetafieldDefinition($id: ID!, $deleteAllAssociatedMetafields: Boolean!) {
				metafieldDefinitionDelete(
					id: $id
					deleteAllAssociatedMetafields: $deleteAllAssociatedMetafields
				) {
					deletedDefinitionId
					userErrors {
						field
						message
						code
					}
				}
			}
		`,
		{ variables }
	);
}

export interface TDeleteMetafieldDefinitionVariables {
	id: string;
	deleteAllAssociatedMetafields: boolean;
}
