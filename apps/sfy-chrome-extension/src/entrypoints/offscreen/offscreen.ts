import { notEmpty } from '@blgc/utils';

import { OffscreenBridge } from '../../lib';
import {
	TBackgroundToOffscreenMessage,
	TOffscreenToBackgroundMessage,
	TShopifyApp
} from '../../types';

export const offscreenBridge = new OffscreenBridge<
	TOffscreenToBackgroundMessage,
	TBackgroundToOffscreenMessage
>();

offscreenBridge.listen('parse_appstore-search-result', async (payload) => {
	const { html } = payload;
	const parser = new DOMParser();
	const document = parser.parseFromString(html, 'text/html');

	const appCardElements = document.querySelectorAll('[data-controller="app-card"]');
	const apps: TShopifyApp[] = Array.from(appCardElements)
		.map((cardElement) => {
			const isAd = cardElement.querySelector('[data-popover-modal-target="activator"]') != null;
			return isAd ? extractAdListingData(cardElement) : extractNormalListingData(cardElement);
		})
		.filter(notEmpty);

	return { apps };
});

function extractAdListingData(cardElement: Element): TShopifyApp | null {
	const handle = cardElement.getAttribute('data-app-card-handle-value');
	if (handle == null) {
		return null;
	}

	const name = cardElement.getAttribute('data-app-card-name-value');
	if (name == null) {
		return null;
	}

	const iconUrl = cardElement.getAttribute('data-app-card-icon-url-value');
	if (iconUrl == null) {
		return null;
	}

	const appLink = cardElement.getAttribute('data-app-card-app-link-value');
	if (appLink == null) {
		return null;
	}

	const offerTokenText = cardElement.getAttribute('data-app-card-offer-token-value');
	if (offerTokenText == null) {
		return null;
	}
	const offerToken = offerTokenText.length > 0 ? offerTokenText : undefined;

	const intraPositionText = cardElement.getAttribute('data-app-card-intra-position-value');
	if (intraPositionText == null) {
		return null;
	}
	const intraPosition = parseInt(intraPositionText, 10);

	const ratingText = cardElement
		.querySelector('div > div > div:nth-child(2) > span:nth-child(2)')
		?.textContent // "4.9\n               out of 5 stars"
		?.trim()
		?.slice(0, 3);
	if (ratingText == null) {
		return null;
	}
	const rating = parseFloat(ratingText);

	const totalReviewsText = cardElement
		.querySelector('div > div > div:nth-child(2) > span:nth-child(4)')
		?.textContent // "(20,372)"
		?.trim()
		?.slice(1, -1)
		?.replace(',', '');
	if (totalReviewsText == null) {
		return null;
	}
	const totalReviews = parseInt(totalReviewsText, 10);

	const pricingInfo = cardElement
		.querySelector('div > div > div:nth-child(2) > span:nth-child(7)')
		?.textContent?.trim();
	if (pricingInfo == null) {
		return null;
	}

	const description = cardElement
		.querySelector('div > div > div:nth-child(3)')
		?.textContent?.trim(); // TODO: Description is empty
	if (description == null) {
		return null;
	}

	const isInstalled =
		cardElement.querySelector('div > div > div:nth-child(4)')?.textContent?.trim() === 'Installed';
	const builtForShopify = !!cardElement.querySelector('.built-for-shopify-badge');

	return {
		handle,
		name,
		iconUrl,
		appLink,
		offerToken,
		intraPosition,
		rating,
		totalReviews,
		description,
		builtForShopify,
		isInstalled,
		pricingInfo,
		isAd: true
	};
}

function extractNormalListingData(cardElement: Element): TShopifyApp | null {
	const handle = cardElement.getAttribute('data-app-card-handle-value');
	if (handle == null) {
		return null;
	}

	const name = cardElement.getAttribute('data-app-card-name-value');
	if (name == null) {
		return null;
	}

	const iconUrl = cardElement.getAttribute('data-app-card-icon-url-value');
	if (iconUrl == null) {
		return null;
	}

	const appLink = cardElement.getAttribute('data-app-card-app-link-value');
	if (appLink == null) {
		return null;
	}

	const offerTokenText = cardElement.getAttribute('data-app-card-offer-token-value');
	if (offerTokenText == null) {
		return null;
	}
	const offerToken = offerTokenText.length > 0 ? offerTokenText : undefined;

	const intraPositionText = cardElement.getAttribute('data-app-card-intra-position-value');
	if (intraPositionText == null) {
		return null;
	}
	const intraPosition = parseInt(intraPositionText, 10);

	const ratingText = cardElement
		.querySelector('div > div > div:nth-child(2) > span:first-child')
		?.textContent // "4.9\n               out of 5 stars"
		?.trim()
		?.slice(0, 3);
	if (ratingText == null) {
		return null;
	}
	const rating = parseFloat(ratingText);

	const totalReviewsText = cardElement
		.querySelector('div > div > div:nth-child(2) > span:nth-child(3)')
		?.textContent // "(20,372)"
		?.trim()
		?.slice(1, -1)
		.replace(',', '');
	if (totalReviewsText == null) {
		return null;
	}
	const totalReviews = parseInt(totalReviewsText, 10);

	const pricingInfo = cardElement
		.querySelector('div > div > div:nth-child(2) > span:nth-child(6)')
		?.textContent?.trim();
	if (pricingInfo == null) {
		return null;
	}

	const description = cardElement
		.querySelector('div > div > div:nth-child(3)')
		?.textContent?.trim();
	if (description == null) {
		return null;
	}

	const isInstalled =
		cardElement.querySelector('div > div > div:nth-child(4)')?.textContent?.trim() === 'Installed';
	const builtForShopify = !!cardElement.querySelector('.built-for-shopify-badge');

	return {
		handle,
		name,
		iconUrl,
		appLink,
		offerToken,
		intraPosition,
		rating,
		totalReviews,
		description,
		builtForShopify,
		isInstalled,
		pricingInfo,
		isAd: false
	};
}
