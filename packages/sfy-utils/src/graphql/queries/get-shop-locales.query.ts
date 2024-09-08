import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export async function getShopLocalesQuery(
	query: TQuery
): Promise<TResult<TGetShopLocalesQueryResponseData, FetchError>> {
	return query<{}, TGetShopLocalesQueryResponseData>(
		gql`
			query GetShopLocales {
				shopLocales {
					locale
					primary
				}
			}
		`,
		{}
	);
}

export interface TGetShopLocalesQueryResponseData {
	shopLocales: {
		locale: string;
		primary: boolean;
	}[];
}
