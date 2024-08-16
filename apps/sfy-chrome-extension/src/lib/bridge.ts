import type { Runtime, Tabs } from 'wxt/browser';

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
> = GBridgeMessage extends TBridgeMessage<GType, infer GPayload, any> ? GPayload : never;

export type TBridgeMessageResponse<
	GBridgeMessage extends TBridgeMessage,
	GType extends TBridgeMessageType<GBridgeMessage>
> = GBridgeMessage extends TBridgeMessage<GType, any, infer GResponse> ? GResponse : never;

export class BackgroundBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	// Send message from background to content
	public async sendMessage<GType extends TBridgeMessageType<GSend>>(
		tabId: number,
		type: GType,
		payload: TBridgeMessagePayload<GSend, GType>,
		options?: Tabs.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, GType>> {
		return browser.tabs.sendMessage(tabId, { type, payload }, options);
	}

	// Listen to message from content in background
	public listen<GType extends TBridgeMessageType<GReceive>>(
		type: GType,
		callback: (
			payload: TBridgeMessagePayload<GReceive, GType>,
			sender: Runtime.MessageSender,
			sendResponse: (response: TBridgeMessageResponse<GReceive, GType>) => void
		) => void
	): void {
		browser.runtime.onMessage.addListener((message: TBridgeMessage, sender, sendResponse) => {
			if (message.type === type) {
				callback(message.payload as any, sender, sendResponse);
			}
		});
	}
}

export class ContentBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	// Send message from content to background
	public async sendMessage<GType extends TBridgeMessageType<GSend>>(
		type: GType,
		payload: TBridgeMessagePayload<GSend, GType>,
		options?: Runtime.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, GType>> {
		return browser.runtime.sendMessage({ type, payload }, options);
	}

	// Listen to message from background in content
	public listen<GType extends TBridgeMessageType<GReceive>>(
		type: GType,
		callback: (
			payload: TBridgeMessagePayload<GReceive, GType>,
			sender: Runtime.MessageSender,
			sendResponse: (response: TBridgeMessageResponse<GReceive, GType>) => void
		) => void
	): void {
		browser.runtime.onMessage.addListener((message: TBridgeMessage, sender, sendResponse) => {
			if (message.type === type) {
				callback(message.payload as any, sender, sendResponse);
			}
		});
	}
}
