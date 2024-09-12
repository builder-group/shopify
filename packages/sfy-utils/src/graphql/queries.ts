import { graphql } from 'gql.tada';

export const GetGenericFileUrlsQuery = graphql(`
	query GetGenericFileUrls($ids: [ID!]!) {
		nodes(ids: $ids) {
			... on GenericFile {
				url
			}
		}
	}
`);

export const GetMetafieldValueQuery = graphql(`
	query GetMetafieldValue($productId: ID!, $namespace: String!, $key: String!) {
		product(id: $productId) {
			metafield(namespace: $namespace, key: $key) {
				value
			}
		}
	}
`);

export const GetShopLocalesQuery = graphql(`
	query GetShopLocales {
		shopLocales {
			locale
			primary
		}
	}
`);

export const GetThemeFileQuery = graphql(`
	query GetThemeFile($themeId: ID!, $filename: String!) {
		theme(id: $themeId) {
			file(filename: $filename) {
				filename
				file {
					filename
					body {
						... on ThemeFileBodyText {
							content
						}
					}
				}
			}
		}
	}
`);
