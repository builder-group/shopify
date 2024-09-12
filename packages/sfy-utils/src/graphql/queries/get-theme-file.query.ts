import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export function getThemeFileQuery(
	variables: TGetThemeFileQueryVariables,
	query: TQuery
): Promise<TResult<TGetThemeFileQueryResponseData, FetchError>> {
	return query<TGetThemeFileQueryResponseData, TGetThemeFileQueryVariables>(
		gql`
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
		`,
		variables
	);
}

export interface TGetThemeFileQueryVariables {
	themeId: string;
	filename: string;
}

export interface TGetThemeFileQueryResponseData {
	theme: {
		file: {
			file: {
				body: {
					content: string;
				};
			} | null;
		};
	};
}
