import { TBridgeMessage } from './lib/utils';

export type TBackgroundToOffscreenMessage = TBridgeMessage<
	'offscreen',
	'extract-shopify-apps-from-html',
	{ html: string },
	{ apps: TShopifyAppListingItem[]; errors: string[] }
>;

export type TOffscreenToBackgroundMessage = TBridgeMessage<'background', 'log', any, void>;

export type TBackgroundToContentMessage = TBridgeMessage<'content', 'actionClicked', void, void>;

export type TContentToBackgroundMessage = TBridgeMessage<
	'background',
	'fetch-shopify-apps',
	{ keyword: string },
	{ pages: TShopifyAppListingPage[]; timeMs: number }
>;

export interface TShopifyAppListingPage {
	apps: TShopifyAppListingItem[];
	errors: string[];
	index: number;
}

export interface TShopifyAppListingItem {
	handle: string;
	name: string;
	iconUrl: string;
	appLink: string;
	offerToken?: string;
	intraPosition: number;
	rating?: number;
	totalReviews?: number;
	description: string;
	builtForShopify: boolean;
	isInstalled: boolean;
	pricingInfo: string;
	isAd: boolean;
}
