import { extractShopifyAppsWithDom } from '../../lib';
import { OffscreenBridge } from '../../lib/utils';
import { TBackgroundToOffscreenMessage, TOffscreenToBackgroundMessage } from '../../types';

export const offscreenBridge = new OffscreenBridge<
	TOffscreenToBackgroundMessage,
	TBackgroundToOffscreenMessage
>();

offscreenBridge.listen('extract-shopify-apps-from-html', async (payload) => {
	const { html } = payload;
	const parser = new DOMParser();
	const document = parser.parseFromString(html, 'text/html');

	return extractShopifyAppsWithDom(document);
});
