import { TBridgeMessage } from './lib';

export type TBackgroundToContentMessage = TBridgeMessage<'actionClicked', void, void>;

export type TContentToBackgroundMessage = TBridgeMessage<
	'ping',
	{ ping: string },
	{ pong: string }
>;
