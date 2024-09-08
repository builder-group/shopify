import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export async function getFileUrlsQuery(
	variables: TGetFileUrlsQueryVariables,
	query: TQuery
): Promise<TResult<TGetFileUrlsQueryResponseData, FetchError>> {
	return query<TGetFileUrlsQueryVariables, TGetFileUrlsQueryResponseData>(
		gql`
			query GetFiles($ids: [ID!]!) {
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
