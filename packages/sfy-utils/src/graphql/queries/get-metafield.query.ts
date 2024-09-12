import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export function getMetafieldQuery<GKeys extends keyof TMetafieldProps>(
	variables: TGetMetafieldQueryVariables,
	metafieldKeys: GKeys[],
	query: TQuery
): Promise<TResult<TGetMetafieldQueryResponseData<GKeys>, FetchError>> {
	return query<TGetMetafieldQueryResponseData<GKeys>, TGetMetafieldQueryVariables>(
		gql`
			query GetMetafield($productId: ID!, $namespace: String!, $key: String!) {
				product(id: $productId) {
					metafield(namespace: $namespace, key: $key) {
						${metafieldKeys.join(' ')}
					}
				}
			}
		`,
		variables
	);
}

export interface TGetMetafieldQueryVariables {
	productId: string;
	namespace: string;
	key: string;
}

export interface TGetMetafieldQueryResponseData<GKeys extends keyof TMetafieldProps> {
	product: {
		metafield: Pick<TMetafieldProps, GKeys> | null;
	};
}

interface TMetafieldProps {
	value: string;
	type: string;
	key: string;
}
