import type { Runtime, Tabs } from 'wxt/browser';

import { queryActiveTab } from './query-active-tab';

export class BackgroundBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	// Send message from background to content
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public async sendMessage<GType extends TBridgeMessageType<GSend>>(
		tabId: number,
		type: GType,
		payload: TBridgeMessagePayload<GSend, GType>,
		options?: Tabs.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, GType>> {
		console.log(`[Send | b->c | ${tabId}] ${type}`, { payload });
		return browser.tabs.sendMessage(tabId, { type, payload }, options);
	}

	public async sendMessageToActiveTab<GType extends TBridgeMessageType<GSend>>(
		type: GType,
		payload: TBridgeMessagePayload<GSend, GType>,
		options?: Tabs.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, GType> | null> {
		const tab = await queryActiveTab();
		if (tab.id != null) {
			return browser.tabs.sendMessage(tab.id, { type, payload }, options);
		}
		return null;
	}

	// Listen to message from content in background
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public listen<GType extends TBridgeMessageType<GReceive>>(
		type: GType,
		callback: (
			payload: TBridgeMessagePayload<GReceive, GType>,
			sender: Runtime.MessageSender
			// sendResponse: (response: TBridgeMessageResponse<GReceive, GType>) => void
		) => Promise<TBridgeMessageResponse<GReceive, GType>>
	): void {
		browser.runtime.onMessage.addListener(async (message: TBridgeMessage, sender, sendResponse) => {
			if (message.type === type) {
				const response = await callback(message.payload as any, sender);
				console.log(`[Received | c->b] ${type}`, { payload: message.payload, response });
				return response;
			}
		});
	}
}

export class ContentBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	// Send message from content to background
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public async sendMessage<GType extends TBridgeMessageType<GSend>>(
		type: GType,
		payload: TBridgeMessagePayload<GSend, GType>,
		options?: Runtime.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, GType>> {
		console.log(`[Send | c->b] ${type}`, { payload });
		return browser.runtime.sendMessage({ type, payload }, options);
	}

	// Listen to message from background in content
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public listen<GType extends TBridgeMessageType<GReceive>>(
		type: GType,
		callback: (
			payload: TBridgeMessagePayload<GReceive, GType>,
			sender: Runtime.MessageSender
			// sendResponse: (response: TBridgeMessageResponse<GReceive, GType>) => void
		) => Promise<TBridgeMessageResponse<GReceive, GType>>
	): void {
		browser.runtime.onMessage.addListener(async (message: TBridgeMessage, sender, sendResponse) => {
			if (message.type === type) {
				const response = await callback(message.payload as any, sender);
				console.log(`[Received | b->c] ${type}`, { payload: message.payload, response });
				return response;
			}
		});
	}
}

export interface TBridgeMessage<
	GType extends string = string,
	GPayload = unknown,
	GResponse = unknown // Inferred
> {
	type: GType;
	payload: GPayload;
}

export type TBridgeMessageType<GBridgeMessage extends TBridgeMessage> =
	GBridgeMessage extends TBridgeMessage<infer GType, any, any> ? GType : never;

export type TBridgeMessagePayload<
	GBridgeMessage extends TBridgeMessage,
	GType extends TBridgeMessageType<GBridgeMessage>
> =
	GBridgeMessage extends TBridgeMessage<GType, infer GPayload, any>
		? GPayload extends void
			? undefined
			: GPayload
		: never;

export type TBridgeMessageResponse<
	GBridgeMessage extends TBridgeMessage,
	GType extends TBridgeMessageType<GBridgeMessage>
> = GBridgeMessage extends TBridgeMessage<GType, any, infer GResponse> ? GResponse : never;
