import { gql } from 'feature-fetch';

import { q } from '../../environment';

export async function getShopLocales() {
	return await q<{}, TGetShopLocalesQueryResponseData>(
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
