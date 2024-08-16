export default defineBackground(() => {
	browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		console.log(message); // "ping"

		const shopifyResult = await fetch('https://apps.shopify.com/search?page=1&q=review', {
			headers: {
				'Accept': 'text/html, application/xhtml+xml',
				'Turbo-Frame': 'search_page'
			}
		});
		const shopifyHtml = await shopifyResult.text();

		console.log('Hello background!', { id: browser.runtime.id, shopifyHtml });

		sendResponse(shopifyResult);

		return true;
	});

	browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
		// Allow action only on specific tab (with specific url)
		if (tab.url != null && tab.url.includes('apps.shopify.com')) {
			browser.action.enable(tabId);
		} else {
			browser.action.disable(tabId);
		}
	});

	browser.action.onClicked.addListener((tab) => {
		if (tab.id != null) {
			browser.tabs.sendMessage(tab.id, { type: 'ACTION_CLICKED' });
		}
	});
});
