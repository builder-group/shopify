import { Err, Ok, TResult } from '@blgc/utils';

import { TShopifyAppListingItem } from '../../types';

export function queryShopifyApps(document: Document): {
	apps: TShopifyAppListingItem[];
	errors: string[];
} {
	const appCardElements = document.querySelectorAll('div[data-controller="app-card"]');
	const apps: TShopifyAppListingItem[] = [];
	const errors: string[] = [];

	Array.from(appCardElements).forEach((cardElement) => {
		const result = extractDataFromAppCardElement(cardElement);
		if (result.isOk()) {
			apps.push(result.value);
		} else {
			errors.push(result.error);
		}
	});

	return { apps, errors };
}

// Query Selector's were determined in the 'html-query-playground' using '@medv/finder'
function extractDataFromAppCardElement(
	cardElement: Element
): TResult<TShopifyAppListingItem, string> {
	const isAd = cardElement.querySelector('.tw-rounded-xl')?.textContent?.trim() === 'Ad';
	const builtForShopify = !!cardElement.querySelector('.built-for-shopify-badge');
	const isInstalled =
		cardElement.querySelector('.tw-text-notifications-success-primary')?.textContent ===
		'Installed';

	const handle = cardElement.getAttribute('data-app-card-handle-value');
	if (handle == null) {
		return Err(`Failed to extract 'handle' value.`);
	}
	const name = cardElement.getAttribute('data-app-card-name-value');
	if (name == null) {
		return Err(`Failed to extract 'name' value.`);
	}
	const iconUrl = cardElement.getAttribute('data-app-card-icon-url-value');
	if (iconUrl == null) {
		return Err(`Failed to extract 'iconUrl' value.`);
	}
	const appLink = cardElement.getAttribute('data-app-card-app-link-value')?.split('?')?.[0];
	if (appLink == null) {
		return Err(`Failed to extract 'appLink' value.`);
	}
	const offerTokenText = cardElement.getAttribute('data-app-card-offer-token-value');
	if (offerTokenText == null) {
		return Err(`Failed to extract 'appLink' value.`);
	}
	const offerToken = offerTokenText.length > 0 ? offerTokenText : undefined;
	const intraPositionText = cardElement.getAttribute('data-app-card-intra-position-value');
	if (intraPositionText == null) {
		return Err(`Failed to extract 'intraPosition' value.`);
	}
	const intraPosition = parseInt(intraPositionText, 10);
	if (isNaN(intraPosition)) {
		return Err(`Failed to parse 'intraPosition' value.`);
	}

	const ratingText = cardElement
		.querySelector(isAd ? '.tw-relative > span:nth-child(2)' : '.tw-relative > span:nth-child(1)')
		?.textContent?.trim()
		.slice(0, 3);
	let rating: undefined | number = undefined;
	if (ratingText != null) {
		const maybeRating = parseFloat(ratingText);
		if (!isNaN(maybeRating)) {
			rating = maybeRating;
		}
	}

	const totalReviewsText = cardElement
		.querySelector(isAd ? 'span:nth-child(4)' : 'span:nth-child(3)')
		?.textContent?.trim()
		.slice(1, -1)
		.replace(',', '');
	let totalReviews: undefined | number = undefined;
	if (totalReviewsText != null) {
		const maybeTotalReviews = parseInt(totalReviewsText);
		if (!isNaN(maybeTotalReviews)) {
			totalReviews = maybeTotalReviews;
		}
	}

	const pricingInfo = cardElement
		.querySelector(isAd ? '.tw-text-ellipsis' : '.tw-whitespace-nowrap')
		?.textContent?.trim();
	if (pricingInfo == null) {
		return Err(`Failed to extract 'pricingInfo' value.`);
	}

	const description = cardElement.querySelector('.tw-text-fg-tertiary')?.textContent?.trim();
	if (description == null) {
		return Err(`Failed to extract 'description' value.`);
	}

	return Ok({
		handle,
		name,
		iconUrl,
		appLink,
		offerToken,
		intraPosition,
		description,
		builtForShopify,
		isInstalled,
		rating,
		totalReviews,
		pricingInfo,
		isAd
	});
}
