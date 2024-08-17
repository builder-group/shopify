import { OffscreenBridge } from '../../lib';
import { TBackgroundToOffscreenMessage, TOffscreenToBackgroundMessage } from '../../types';

export const offscreenBridge = new OffscreenBridge<
	TOffscreenToBackgroundMessage,
	TBackgroundToOffscreenMessage
>();

offscreenBridge.listen('parse', async (payload) => {
	const { html } = payload;
	const parser = new DOMParser();
	const document = parser.parseFromString(html, 'text/html');

	const result = Array.from(document.querySelectorAll('[data-controller="app-card"]')).map(
		(element) => element.getAttribute('data-app-card-handle-value')
	);

	return { result };
});
