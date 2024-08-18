import { extractShopifyAppsWithXml } from '../../lib';
import { BackgroundBridge, closeOffscreenDocument, createOffscreenDocument } from '../../lib/utils';
import {
	TBackgroundToContentMessage,
	TBackgroundToOffscreenMessage,
	TContentToBackgroundMessage,
	TOffscreenToBackgroundMessage
} from '../../types';

const backgroundBridge = new BackgroundBridge<
	TBackgroundToContentMessage | TBackgroundToOffscreenMessage,
	TContentToBackgroundMessage | TOffscreenToBackgroundMessage
>();

export default defineBackground(() => {
	backgroundBridge.listen('fetch-shopify-apps', async (payload) => {
		const { keyword } = payload;

		const shopifyResult = await fetch(`https://apps.shopify.com/search?page=1&q=${keyword}`, {
			headers: {
				'Accept': 'text/html, application/xhtml+xml',
				'Turbo-Frame': 'search_page'
			}
		});
		const shopifyHtml = await shopifyResult.text();

		// Extract Shopify Apps with Xml-Tokenizer
		console.time('Extract Shopify Apps with Xml-Tokenizer');
		const appsWihtXml = extractShopifyAppsWithXml(shopifyHtml);
		console.timeEnd('Extract Shopify Apps with Xml-Tokenizer');

		// Extract Shopify Apps with Offscreen DOM
		console.time('Extract Shopify Apps with Offscreen DOM');
		await createOffscreenDocument();
		const appsWithOffscreenDom = await backgroundBridge.sendMessageToOffscreen(
			'extract-shopify-apps-from-html',
			{
				html: shopifyHtml
			}
		);
		await closeOffscreenDocument();
		console.timeEnd('Extract Shopify Apps with Offscreen DOM');

		console.log({ appsWihtXml, appsWithOffscreenDom });

		return appsWihtXml;
	});

	backgroundBridge.listen('log', async (payload) => {
		console.log('[offscreen]', payload);
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
