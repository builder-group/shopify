# `@repo/sfy-eu-blocks-admin-block-extension`

- [Allowed Components](https://shopify.dev/docs/api/admin-extensions/2024-07#overview)
- [Admin GraphQL](https://shopify.dev/docs/api/admin-graphql/)
- [GraphiQL](https://shopify.dev/docs/api/usage/api-exploration/admin-graphiql-explorer) - Start by pressing `g`

## Debug

### Delete metafield definition
```
mutation DeleteMetafieldDefinition($id: ID!) {
  metafieldDefinitionDelete(id: $id, deleteAllAssociatedMetafields: true) {
    deletedDefinitionId,
    userErrors {
      code
      field
      message
    }
  }
}
```