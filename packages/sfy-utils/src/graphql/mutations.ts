import { graphql } from 'gql.tada';

export const CreateFileMutation = graphql(`
	mutation CreateFile($files: [FileCreateInput!]!) {
		fileCreate(files: $files) {
			files {
				id
			}
			userErrors {
				field
				message
				code
			}
		}
	}
`);

export const DeleteMetafieldMutation = graphql(`
	mutation DeleteMetafield($productId: ID!, $namespace: String!, $key: String!) {
		metafieldsDelete(metafields: [{ ownerId: $productId, namespace: $namespace, key: $key }]) {
			userErrors {
				field
				message
			}
		}
	}
`);

export const UpdateMetafieldMutation = graphql(`
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
`);
