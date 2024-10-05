import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export async function createFileMutation(
	variables: TCreateFileMutationVariables,
	query: TQuery
): Promise<TResult<TCreateFileMutationResponseData, FetchError>> {
	return query<TCreateFileMutationResponseData, TCreateFileMutationVariables>(
		gql`
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
		`,
		variables
	);
}

export interface TCreateFileMutationVariables {
	files: {
		filename: string;
		contentType: 'IMAGE' | 'FILE' | 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D';
		alt: string;
		originalSource: string;
	}[];
}

export interface TCreateFileMutationResponseData {
	fileCreate: {
		files: {
			id: string;
		}[];
		userErrors: {
			field: string[];
			message: string;
			code: string;
		}[];
	};
}
