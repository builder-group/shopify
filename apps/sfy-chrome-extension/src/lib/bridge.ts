import type { Runtime, Tabs } from 'wxt/browser';

import { hasOffscreenDocument } from './offscreen';
import { queryActiveTab } from './query-active-tab';

export class BackgroundBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	private messageHandlers: Map<
		string,
		(payload: any, sender: Runtime.MessageSender) => Promise<any>
	> = new Map();

	constructor() {
		browser.runtime.onMessage.addListener(
			async (message: TBridgeMessage, sender: Runtime.MessageSender) => {
				if (message.target !== 'background') {
					return false; // No asynchronous response expected if wrong target
				}

				const handler = this.messageHandlers.get(message.type);
				if (handler != null) {
					const response = await handler(message.payload, sender);
					console.log(`[Received | b] ${message.type}`, { payload: message.payload, response });
					return response;
				}

				console.warn(`No handler found for message type: ${message.type}`);
				return false; // No asynchronous response expected if no handler was found
			}
		);
	}

	// Send message from background to content
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public async sendMessageToContent<GType extends TBridgeMessageType<GSend, 'content'>>(
		tabId: number,
		type: GType,
		payload: TBridgeMessagePayload<GSend, 'content', GType>,
		options?: Tabs.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, 'content', GType>> {
		console.log(`[Send | b->c | ${tabId}] ${type}`, { payload });
		return browser.tabs.sendMessage(tabId, { type, payload, target: 'content' }, options);
	}

	public async sendMessageToContentOnActiveTab<GType extends TBridgeMessageType<GSend, 'content'>>(
		type: GType,
		payload: TBridgeMessagePayload<GSend, 'content', GType>,
		options?: Tabs.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, 'content', GType> | null> {
		const tab = await queryActiveTab();
		if (tab.id != null) {
			return this.sendMessageToContent(tab.id, type, payload, options);
		}
		return null;
	}

	// Send message from background to offscreen
	// https://developer.chrome.com/docs/extensions/reference/api/offscreen
	public async sendMessageToOffscreen<GType extends TBridgeMessageType<GSend, 'offscreen'>>(
		type: GType,
		payload: TBridgeMessagePayload<GSend, 'offscreen', GType>,
		options?: Runtime.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, 'offscreen', GType>> {
		console.log(`[Send | b->o] ${type}`, { payload });
		if (!(await hasOffscreenDocument())) {
			console.warn('No offscreen document found!');
		}
		return browser.runtime.sendMessage({ type, payload, target: 'offscreen' }, options);
	}

	// Listen to message in background
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public listen<GType extends TBridgeMessageType<GReceive, TTarget>>(
		type: GType,
		callback: (
			payload: TBridgeMessagePayload<GReceive, TTarget, GType>,
			sender: Runtime.MessageSender
			// sendResponse: (response: TBridgeMessageResponse<GReceive, GType>) => void
		) => Promise<TBridgeMessageResponse<GReceive, TTarget, GType>>
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
				if (message.target !== 'content') {
					return false; // No asynchronous response expected if wrong target
				}

				const handler = this.messageHandlers.get(message.type);
				if (handler != null) {
					const response = await handler(message.payload, sender);
					console.log(`[Received | c] ${message.type}`, { payload: message.payload, response });
					return response;
				}

				console.warn(`No handler found for message type: ${message.type}`);
				return false; // No asynchronous response expected if no handler was found
			}
		);
	}

	// Send message from content to background
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public async sendMessageToBackground<GType extends TBridgeMessageType<GSend, 'background'>>(
		type: GType,
		payload: TBridgeMessagePayload<GSend, 'background', GType>,
		options?: Runtime.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, 'background', GType>> {
		console.log(`[Send | c->b] ${type}`, { payload });
		return browser.runtime.sendMessage({ type, payload, target: 'background' }, options);
	}

	// Listen to message in content
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	public listen<GType extends TBridgeMessageType<GReceive, TTarget>>(
		type: GType,
		callback: (
			payload: TBridgeMessagePayload<GReceive, TTarget, GType>,
			sender: Runtime.MessageSender
			// sendResponse: (response: TBridgeMessageResponse<GReceive, GType>) => void
		) => Promise<TBridgeMessageResponse<GReceive, TTarget, GType>>
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

export class OffscreenBridge<GSend extends TBridgeMessage, GReceive extends TBridgeMessage> {
	private messageHandlers: Map<
		string,
		(payload: any, sender: Runtime.MessageSender) => Promise<any>
	> = new Map();

	constructor() {
		browser.runtime.onMessage.addListener(
			async (message: TBridgeMessage, sender: Runtime.MessageSender) => {
				if (message.target !== 'offscreen') {
					return false; // No asynchronous response expected if wrong target
				}

				const handler = this.messageHandlers.get(message.type);
				if (handler != null) {
					const response = await handler(message.payload, sender);
					console.log(`[Received | o] ${message.type}`, { payload: message.payload, response });
					return response;
				}

				console.warn(`No handler found for message type: ${message.type}`);
				return false; // No asynchronous response expected if no handler was found
			}
		);
	}

	// Send message from offscreen to background
	// https://developer.chrome.com/docs/extensions/reference/api/offscreen
	public async sendMessageToBackground<GType extends TBridgeMessageType<GSend, 'background'>>(
		type: GType,
		payload: TBridgeMessagePayload<GSend, 'background', GType>,
		options?: Runtime.SendMessageOptionsType
	): Promise<TBridgeMessageResponse<GSend, 'background', GType>> {
		console.log(`[Send | o->b] ${type}`, { payload });
		return browser.runtime.sendMessage({ type, payload, target: 'background' }, options);
	}

	// Listen to message in offscreen
	// https://developer.chrome.com/docs/extensions/reference/api/offscreen
	public listen<GType extends TBridgeMessageType<GReceive, TTarget>>(
		type: GType,
		callback: (
			payload: TBridgeMessagePayload<GReceive, TTarget, GType>,
			sender: Runtime.MessageSender
			// sendResponse: (response: TBridgeMessageResponse<GReceive, GType>) => void
		) => Promise<TBridgeMessageResponse<GReceive, TTarget, GType>>
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
	GTarget extends TTarget = TTarget,
	GType extends string = string,
	GPayload = unknown,
	GResponse = unknown // Inferred
> {
	type: GType;
	payload: GPayload;
	target: GTarget;
}

export type TBridgeMessageTarget<GBridgeMessage extends TBridgeMessage> =
	GBridgeMessage extends TBridgeMessage<infer GTarget, any, any, any> ? GTarget : never;

export type TBridgeMessageType<GBridgeMessage extends TBridgeMessage, GTarget extends TTarget> =
	GBridgeMessage extends TBridgeMessage<GTarget, infer GType, any, any> ? GType : never;

export type TBridgeMessagePayload<
	GBridgeMessage extends TBridgeMessage,
	GTarget extends TTarget,
	GType extends TBridgeMessageType<GBridgeMessage, GTarget>
> =
	GBridgeMessage extends TBridgeMessage<GTarget, GType, infer GPayload, any>
		? GPayload extends void
			? undefined
			: GPayload
		: never;

export type TBridgeMessageResponse<
	GBridgeMessage extends TBridgeMessage,
	GTarget extends TTarget,
	GType extends TBridgeMessageType<GBridgeMessage, GTarget>
> = GBridgeMessage extends TBridgeMessage<GTarget, GType, any, infer GResponse> ? GResponse : never;

type TTarget = 'offscreen' | 'content' | 'background';
