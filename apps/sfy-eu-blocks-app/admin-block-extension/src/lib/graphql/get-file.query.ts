import { gql } from 'feature-fetch';

import { q } from '../../environment';

export async function getFilesQuery(variables: TGetFileQueryVariables) {
	return await q<TGetFileQueryVariables, TGetMetafieldQueryResponseData>(
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

export interface TGetMetafieldQueryResponseData {
	nodes: {
		id: string;
	}[];
}
