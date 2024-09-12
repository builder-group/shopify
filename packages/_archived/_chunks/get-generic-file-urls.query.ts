import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export async function getGenericFileUrlsQuery(
	variables: TGetFileUrlsQueryVariables,
	query: TQuery
): Promise<TResult<TGetFileUrlsQueryResponseData, FetchError>> {
	return query<TGetFileUrlsQueryResponseData, TGetFileUrlsQueryVariables>(
		gql`
			query GetGenericFileUrls($ids: [ID!]!) {
				nodes(ids: $ids) {
					... on GenericFile {
						url
					}
				}
			}
		`,
		variables
	);
}

export interface TGetFileUrlsQueryVariables {
	ids: string[];
}

export interface TGetFileUrlsQueryResponseData {
	nodes: {
		id: string;
	}[];
}
