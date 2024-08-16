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

	// browser.browserAction.onClicked.addListener((tab) => {
	// 	console.log('Clicked');
	// });
});
