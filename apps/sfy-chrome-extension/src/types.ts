import { TBridgeMessage } from './lib';

export type TBackgroundToOffscreenMessage = TBridgeMessage<
	'offscreen',
	'parse_appstore-search-result',
	{ html: string },
	{ apps: TShopifyApp[] }
>;

export type TOffscreenToBackgroundMessage = TBridgeMessage<'background', 'log', any, void>;

export type TBackgroundToContentMessage = TBridgeMessage<'content', 'actionClicked', void, void>;

export type TContentToBackgroundMessage = TBridgeMessage<
	'background',
	'scrap-apps',
	{ keyword: string },
	{ apps: TShopifyApp[] }
>;

export interface TShopifyApp {
	handle: string;
	name: string;
	iconUrl: string;
	appLink: string;
	offerToken?: string;
	intraPosition: number;
	rating: number;
	totalReviews: number;
	description: string;
	builtForShopify: boolean;
	isInstalled: boolean;
	pricingInfo: string;
	isAd: boolean;
}
