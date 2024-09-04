import { gql } from 'feature-fetch';

import { q } from '../../environment';

export async function createFileMutation(variables: TCreateFileMutationVariables) {
	return await q<TCreateFileMutationVariables, TCreateFileMutationResponseData>(
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
