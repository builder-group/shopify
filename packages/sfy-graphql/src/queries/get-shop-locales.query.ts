import { gql, type FetchError, type TResult } from 'feature-fetch';

import { type TQuery } from '../types';

export async function getShopLocales(
	query: TQuery
): Promise<TResult<TGetShopLocalesQueryResponseData, FetchError>> {
	return query<{}, TGetShopLocalesQueryResponseData>(
		gql`
			query shopInfo {
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
