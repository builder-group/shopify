import { Err, Ok, TResult } from '@blgc/utils';

import { TShopifyApp } from '../../types';

export function queryShopifyAppsWithQuerySelector(document: Document): {
	apps: TShopifyApp[];
	errors: string[];
} {
	const appCardElements = document.querySelectorAll('div[data-controller="app-card"]');
	const apps: TShopifyApp[] = [];
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
function extractDataFromAppCardElement(cardElement: Element): TResult<TShopifyApp, string> {
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
	const appLink = cardElement.getAttribute('data-app-card-app-link-value');
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
	if (ratingText == null) {
		return Err(`Failed to extract 'rating' value.`);
	}
	const rating = parseFloat(ratingText);
	if (isNaN(rating)) {
		return Err(`Failed to parse 'rating' value.`);
	}

	const totalReviewsText = cardElement
		.querySelector(isAd ? 'span:nth-child(4)' : 'span:nth-child(3)')
		?.textContent?.trim()
		.slice(1, -1)
		.replace(',', '');
	if (totalReviewsText == null) {
		return Err(`Failed to extract 'totalReviews' value.`);
	}
	const totalReviews = parseInt(totalReviewsText);
	if (isNaN(totalReviews)) {
		return Err(`Failed to parse 'totalReviews' value.`);
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
