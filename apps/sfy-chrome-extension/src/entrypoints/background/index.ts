import { createApiFetchClient } from 'feature-fetch';

import { BackgroundBridge, closeOffscreenDocument, createOffscreenDocument } from '../../lib/utils';
import {
	TBackgroundToContentMessage,
	TBackgroundToOffscreenMessage,
	TContentToBackgroundMessage,
	TOffscreenToBackgroundMessage,
	TShopifyAppListingPage
} from '../../types';

const backgroundBridge = new BackgroundBridge<
	TBackgroundToContentMessage | TBackgroundToOffscreenMessage,
	TContentToBackgroundMessage | TOffscreenToBackgroundMessage
>();

const fetchClient = createApiFetchClient({ prefixUrl: 'https://apps.shopify.com' });

export default defineBackground(() => {
	backgroundBridge.listen('fetch-shopify-apps', async (payload) => {
		const { keyword } = payload;
		const startingPagination = 1;
		const maxPagination = 40; // Rate limit is at 44 in 15s

		const pages: TShopifyAppListingPage[] = [];

		const start = Date.now();
		await createOffscreenDocument();
		for (let i = startingPagination; i < maxPagination; i++) {
			const result = await fetchClient.get('/search', {
				queryParams: {
					page: i,
					q: keyword
				},
				headers: {
					'Accept': 'text/html, application/xhtml+xml',
					'Turbo-Frame': 'search_page'
				},
				parseAs: 'text'
			});

			if (result.isErr()) {
				console.log('Error', { result });
				break;
			}
			const html = result.value.data;

			// Extract apps from HTML
			const extractionResult = await backgroundBridge.sendMessageToOffscreen(
				'extract-shopify-apps-from-html',
				{ html }
			);

			// If no apps
			if (extractionResult.apps.length <= 0) {
				break;
			}

			pages.push({ index: i, apps: extractionResult.apps, errors: extractionResult.errors });
		}
		await closeOffscreenDocument();

		const end = Date.now();

		return { pages, timeMs: end - start };
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
