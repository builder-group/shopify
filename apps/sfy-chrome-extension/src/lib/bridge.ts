import type { Runtime, Tabs } from 'wxt/browser';

import { queryActiveTab } from './query-active-tab';

export class BackgroundBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	private messageHandlers: Map<
		string,
		(payload: any, sender: Runtime.MessageSender) => Promise<any>
	> = new Map();

	constructor() {
		browser.runtime.onMessage.addListener(
			async (message: TBridgeMessage, sender: Runtime.MessageSender) => {
				const handler = this.messageHandlers.get(message.type);
				if (handler != null) {
					const response = await handler(message.payload, sender);
					console.log(`[Received | c->b] ${message.type}`, { payload: message.payload, response });
					return response;
				}

				console.warn(`No handler found for message type: ${message.type}`);
				return false; // No asynchronous response expected if no handler was found
			}
		);
	}

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
		if (!this.messageHandlers.has(type)) {
			this.messageHandlers.set(type, callback);
		} else {
			console.error(
				`Handler for message type '${type}' already exists. Only one handler is allowed per message type.`
			);
		}
	}
}

export class ContentBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	private messageHandlers: Map<
		string,
		(payload: any, sender: Runtime.MessageSender) => Promise<any>
	> = new Map();

	constructor() {
		browser.runtime.onMessage.addListener(
			async (message: TBridgeMessage, sender: Runtime.MessageSender) => {
				const handler = this.messageHandlers.get(message.type);
				if (handler != null) {
					const response = await handler(message.payload, sender);
					console.log(`[Received | b->c] ${message.type}`, { payload: message.payload, response });
					return response;
				}

				console.warn(`No handler found for message type: ${message.type}`);
				return false; // No asynchronous response expected if no handler was found
			}
		);
	}

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
		if (!this.messageHandlers.has(type)) {
			this.messageHandlers.set(type, callback);
		} else {
			console.error(
				`Handler for message type '${type}' already exists. Only one handler is allowed per message type.`
			);
		}
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
