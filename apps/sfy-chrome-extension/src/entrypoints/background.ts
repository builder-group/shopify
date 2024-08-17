import {
	processTokenForSimplifiedObject,
	select,
	TSelectedXmlToken,
	TXmlToken
} from 'xml-tokenizer';

import { BackgroundBridge, closeOffscreenDocument, createOffscreenDocument } from '../lib';
import {
	TBackgroundToContentMessage,
	TBackgroundToOffscreenMessage,
	TContentToBackgroundMessage,
	TOffscreenToBackgroundMessage,
	TShopifyApp
} from '../types';

const backgroundBridge = new BackgroundBridge<
	TBackgroundToContentMessage | TBackgroundToOffscreenMessage,
	TContentToBackgroundMessage | TOffscreenToBackgroundMessage
>();

export default defineBackground(() => {
	backgroundBridge.listen('scrap-apps', async (payload) => {
		const { keyword } = payload;

		const shopifyResult = await fetch(`https://apps.shopify.com/search?page=1&q=${keyword}`, {
			headers: {
				'Accept': 'text/html, application/xhtml+xml',
				'Turbo-Frame': 'search_page'
			}
		});
		const shopifyHtml = await shopifyResult.text();

		console.log({ shopifyHtml });

		const appsWihtXmlTokenizer = getNamesWithXmlTokenizer(shopifyHtml);

		const appsWithOffscreenDom = await getNamesWithOffscreenDom(shopifyHtml);

		console.log({ appsWihtXmlTokenizer, appsWithOffscreenDom });

		return { apps: appsWihtXmlTokenizer };
	});

	backgroundBridge.listen('log', async (payload) => {
		console.log(payload);
	});

	browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		// Allow action only on specific tab (with specific url)
		if (tab.url != null && tab.url.includes('apps.shopify.com')) {
			browser.action.enable(tabId);
		} else {
			browser.action.disable(tabId);
		}
	});

	browser.runtime.onInstalled.addListener(() => {
		browser.action.disable();
	});

	browser.action.onClicked.addListener((tab) => {
		if (tab.id != null) {
			backgroundBridge.sendMessageToContent(tab.id, 'actionClicked', undefined);
		}
	});
});

async function getNamesWithOffscreenDom(html: string): Promise<TShopifyApp[]> {
	await createOffscreenDocument();
	const result = await backgroundBridge.sendMessageToOffscreen('parse', { html });
	await closeOffscreenDocument();
	return result.result;
}

function getNamesWithXmlTokenizer(html: string): TShopifyApp[] {
	const results: any[] = [];
	let stack: any[] = [];
	let tokens: TSelectedXmlToken[] = [];
	select(
		html,
		[
			[
				{
					axis: 'self-or-descendant',
					local: 'div',
					attributes: [
						{ local: 'data-controller', value: 'app-card' }
						// { local: 'data-app-card-handle-value', value: 'loox' }
					]
				}
			]
		],
		(token) => {
			tokens.push(token);

			if (token.type === 'SelectionStart') {
				const result: any = {};
				results.push(result);
				stack = [result];
				return;
			}

			if (token.type === 'SelectionEnd') {
				return;
			}

			processTokenForSimplifiedObject(token as TXmlToken, stack);
		}
	);

	return results.map((result: any) => ({
		name: result._div.attributes['data-app-card-handle-value']
	}));
}
