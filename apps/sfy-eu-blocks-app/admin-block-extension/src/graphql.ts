import { createGraphQLFetchClient, gql } from 'feature-fetch';

const graphQLClient = createGraphQLFetchClient({ prefixUrl: 'shopify:admin/api/graphql.json' });

export async function updateMetafield(variables: TUpdateMetaFieldVariables) {
	return await graphQLClient.query<
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

interface TUpdateMetaFieldVariables {
	ownerId: string;
	namespace: string;
	key: string;
	type: string;
	value: string;
	name: string;
	ownerType: string;
}

export async function getMetafield(variables: TGetMetafieldVariables) {
	return await graphQLClient.query<
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

interface TGetMetafieldVariables {
	id: string;
	namespace: string;
	key: string;
}
