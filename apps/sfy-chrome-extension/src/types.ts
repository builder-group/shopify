import { TBridgeMessage } from './lib';

export type TBackgroundToContentMessage = TBridgeMessage<'actionClicked', void, void>;

export type TContentToBackgroundMessage = TBridgeMessage<
	'scrap-apps',
	{ keyword: string },
	{ apps: TShopifyApp[] }
>;

export interface TShopifyApp {
	name: string;
}
