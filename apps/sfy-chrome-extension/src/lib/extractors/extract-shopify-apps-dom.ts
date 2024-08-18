import { Err, Ok, TResult } from 'feature-fetch';

import { TShopifyApp } from '../../types';

export function extractShopifyAppsWithDom(document: Document): {
	apps: TShopifyApp[];
	errors: string[];
} {
	const appCardElements = document.querySelectorAll('[data-controller="app-card"]');
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

function extractDataFromAppCardElement(cardElement: Element): TResult<TShopifyApp, string> {
	const isAd = cardElement.querySelector('[data-popover-modal-target="activator"]') != null;
	const extractorFunction = isAd
		? extractDataFromAdAppCardElement
		: extractDataFromNormalAppCardElement;
	return extractorFunction(cardElement);
}

function extractDataFromAdAppCardElement(cardElement: Element): TResult<TShopifyApp, string> {
	const dataResult = extractCommonDataAppCardElement(cardElement);
	if (dataResult.isErr()) {
		return dataResult as TResult<TShopifyApp, string>;
	}

	// Extract data from not common elements
	const ratingElement = cardElement.querySelector(
		'div > div > div:nth-child(2) > span:nth-child(2)'
	);
	const totalReviewsElement = cardElement.querySelector(
		'div > div > div:nth-child(2) > span:nth-child(4)'
	);
	const pricingInfoElement = cardElement.querySelector(
		'div > div > div:nth-child(2) > span:last-child'
	);
	if (ratingElement == null || totalReviewsElement == null || pricingInfoElement == null) {
		return Err('Missing rating, reviews, or pricing info elements in ad listing');
	}
	const rating = parseRating(ratingElement.textContent);
	const totalReviews = parseTotalReviews(totalReviewsElement.textContent);
	const pricingInfo = pricingInfoElement.textContent?.trim() ?? '';
	if (rating == null || totalReviews == null) {
		return Err('Invalid rating or total reviews in ad listing');
	}

	return Ok({
		...dataResult.value,
		rating,
		totalReviews,
		pricingInfo,
		isAd: true
	});
}

function extractDataFromNormalAppCardElement(cardElement: Element): TResult<TShopifyApp, string> {
	const dataResult = extractCommonDataAppCardElement(cardElement);
	if (dataResult.isErr()) {
		return dataResult as TResult<TShopifyApp, string>;
	}

	// Extract data from not common elements
	const ratingElement = cardElement.querySelector(
		'div > div > div:nth-child(2) > span:first-child'
	);
	const totalReviewsElement = cardElement.querySelector(
		'div > div > div:nth-child(2) > span:nth-child(3)'
	);
	const pricingInfoElement = cardElement.querySelector(
		'div > div > div:nth-child(2) > span:last-child'
	);
	if (ratingElement == null || totalReviewsElement == null || pricingInfoElement == null) {
		return Err('Missing rating, reviews, or pricing info elements in normal listing');
	}
	const rating = parseRating(ratingElement.textContent);
	const totalReviews = parseTotalReviews(totalReviewsElement.textContent);
	const pricingInfo = pricingInfoElement.textContent?.trim() ?? '';
	if (rating == null || totalReviews == null) {
		return Err('Invalid rating or total reviews in normal listing');
	}

	return Ok({
		...dataResult.value,
		rating,
		totalReviews,
		pricingInfo,
		isAd: false
	});
}

function extractCommonDataAppCardElement(
	cardElement: Element
): TResult<Omit<TShopifyApp, 'rating' | 'totalReviews' | 'pricingInfo' | 'isAd'>, string> {
	// Extract data from attributes
	const handle = cardElement.getAttribute('data-app-card-handle-value');
	const name = cardElement.getAttribute('data-app-card-name-value');
	const iconUrl = cardElement.getAttribute('data-app-card-icon-url-value');
	const appLink = cardElement.getAttribute('data-app-card-app-link-value');
	const offerTokenText = cardElement.getAttribute('data-app-card-offer-token-value');
	const intraPositionText = cardElement.getAttribute('data-app-card-intra-position-value');
	if (
		handle == null ||
		name == null ||
		iconUrl == null ||
		appLink == null ||
		offerTokenText == null ||
		intraPositionText == null
	) {
		return Err('Missing one or more common data attributes');
	}
	const offerToken = offerTokenText.length > 0 ? offerTokenText : undefined;
	const intraPosition = parseInt(intraPositionText, 10);

	// Extract data from elements
	const descriptionElement = cardElement.querySelector(
		'div > div > div.tw-text-body-xs.tw-text-fg-tertiary'
	);
	// const descriptionElement = cardElement.querySelector('div > div > div:nth-child(3)');
	const isInstalledElement = cardElement.querySelector(
		'div > div > div.tw-text-body-xs.tw-text-notifications-success-primary'
	);
	// const isInstalledElement = cardElement.querySelector('div > div > div:nth-child(4)');
	if (descriptionElement == null) {
		return Err('Missing description element');
	}

	const description = descriptionElement.textContent?.trim() ?? '';
	const isInstalled = isInstalledElement?.textContent?.trim() === 'Installed';
	const builtForShopify = cardElement.querySelector('.built-for-shopify-badge') != null;

	return Ok({
		handle,
		name,
		iconUrl,
		appLink,
		offerToken,
		intraPosition,
		description,
		builtForShopify,
		isInstalled
	});
}

function parseRating(ratingText: string | null): number | null {
	if (ratingText == null) {
		return null;
	}
	const rating = parseFloat(ratingText.trim().slice(0, 3));
	return isNaN(rating) ? null : rating;
}

function parseTotalReviews(totalReviewsText: string | null): number | null {
	if (totalReviewsText == null) {
		return null;
	}
	const cleanedText = totalReviewsText.trim().slice(1, -1).replace(',', '');
	const totalReviews = parseInt(cleanedText, 10);
	return isNaN(totalReviews) ? null : totalReviews;
}
