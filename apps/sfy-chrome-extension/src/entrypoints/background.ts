import { BackgroundBridge } from '../lib';
import { TBackgroundToContentMessage, TContentToBackgroundMessage } from '../types';

const backgroundBridge = new BackgroundBridge<
	TBackgroundToContentMessage,
	TContentToBackgroundMessage
>();

export default defineBackground(() => {
	backgroundBridge.listen('ping', async (payload) => {
		console.log({ payload }); // "ping"

		const shopifyResult = await fetch('https://apps.shopify.com/search?page=1&q=review', {
			headers: {
				'Accept': 'text/html, application/xhtml+xml',
				'Turbo-Frame': 'search_page'
			}
		});
		const shopifyHtml = await shopifyResult.text();

		console.log('Hello background!', { id: browser.runtime.id, shopifyHtml });

		return { pong: 'Hii' };
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
			backgroundBridge.sendMessage(tab.id, 'actionClicked', undefined);
		}
	});
});
