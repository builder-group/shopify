import { TBridgeMessage } from './lib';

export type TBackgroundToContentMessage =
	| TBridgeMessage<'updateData', { data: string }, void>
	| TBridgeMessage<'showNotification', { notification: string }, boolean>;

export type TContentToBackgroundMessage = TBridgeMessage<'ping', string, string>;
