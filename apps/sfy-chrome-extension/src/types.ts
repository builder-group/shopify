import { TBridgeMessage } from './lib';

export type TBackgroundToOffscreenMessage = TBridgeMessage<
	'offscreen',
	'parse',
	{ html: string },
	{ result: any }
>;

export type TOffscreenToBackgroundMessage = TBridgeMessage<
	'background',
	'log',
	{ log: string },
	void
>;

export type TBackgroundToContentMessage = TBridgeMessage<'content', 'actionClicked', void, void>;

export type TContentToBackgroundMessage = TBridgeMessage<
	'background',
	'scrap-apps',
	{ keyword: string },
	{ apps: TShopifyApp[] }
>;

export interface TShopifyApp {
	name: string;
}
