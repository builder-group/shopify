import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export async function getFilesQuery(
	variables: TGetFileQueryVariables,
	query: TQuery
): Promise<TResult<TGetFileQueryResponseData, FetchError>> {
	return query<TGetFileQueryVariables, TGetFileQueryResponseData>(
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

export interface TGetFileQueryVariables {
	ids: string[];
}

export interface TGetFileQueryResponseData {
	nodes: {
		id: string;
	}[];
}
