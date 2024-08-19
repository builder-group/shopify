import { Err, Ok, TResult } from 'feature-fetch';
import {
	processTokenForSimplifiedObject,
	select,
	TSelectedXmlToken,
	TSimplifiedXmlNode,
	TXmlToken
} from 'xml-tokenizer';

import { TShopifyApp } from '../../types';

export function queryShopifyAppsWithXmlTokenizer(html: string): {
	apps: TShopifyApp[];
	errors: string[];
} {
	const appCardElements: TSimplifiedXmlNode[] = [];
	let stack: TSimplifiedXmlNode[] = [];
	let tokens: TSelectedXmlToken[] = [];

	select(
		html,
		[
			[
				{
					axis: 'self-or-descendant',
					local: 'div',
					attributes: [{ local: 'data-controller', value: 'app-card' }]
				}
			]
		],
		(token) => {
			tokens.push(token);

			if (token.type === 'SelectionStart') {
				const result: any = {};
				appCardElements.push(result);
				stack = [result];
				return;
			}

			if (token.type === 'SelectionEnd') {
				return;
			}

			processTokenForSimplifiedObject(token as TXmlToken, stack);
		}
	);

	const apps: TShopifyApp[] = [];
	const errors: string[] = [];

	Array.from(appCardElements).forEach((cardElement) => {
		const cardElementDiv = cardElement._div?.[0];
		if (cardElementDiv != null) {
			const result = extractDataFromAppCardElement(cardElementDiv);
			if (result.isOk()) {
				apps.push(result.value);
			} else {
				errors.push(result.error);
			}
		}
	});

	return { apps, errors };
}

function extractDataFromAppCardElement(
	cardElement: TSimplifiedXmlNode
): TResult<TShopifyApp, string> {
	const isAd =
		cardElement._div?.[0]?._div?.[0]?._div?.[0]?._div?.[1]?._div?.[0]?._span?.[0]?.text === 'Ad';
	const isInstalled = cardElement._div?.[0]?._div?.[0]?._div?.[0]?._div?.[3]?.text === 'Installed';
	const builtForShopify =
		(cardElement._div?.[0]?._div?.[0]?._div?.[0]?._div?.[4]?._span?.[0]?._span?.[1]?.text ??
			cardElement._div?.[0]?._div?.[0]?._div?.[0]?._div?.[3]?._span?.[0]?._span?.[1]?.text) ===
		'Built for Shopify';

	const handle = cardElement?.attributes?.['data-app-card-handle-value'];
	if (handle == null) {
		return Err(`Failed to extract 'handle' value.`);
	}
	const name = cardElement?.attributes?.['data-app-card-name-value'];
	if (name == null) {
		return Err(`Failed to extract 'name' value.`);
	}
	const iconUrl = cardElement?.attributes?.['data-app-card-icon-url-value'];
	if (iconUrl == null) {
		return Err(`Failed to extract 'iconUrl' value.`);
	}
	const appLink = cardElement?.attributes?.['data-app-card-app-link-value'];
	if (appLink == null) {
		return Err(`Failed to extract 'appLink' value.`);
	}
	const offerTokenText = cardElement?.attributes?.['data-app-card-offer-token-value'];
	if (offerTokenText == null) {
		return Err(`Failed to extract 'appLink' value.`);
	}
	const offerToken = offerTokenText.length > 0 ? offerTokenText : undefined;
	const intraPositionText = cardElement?.attributes?.['data-app-card-intra-position-value'];
	if (intraPositionText == null) {
		return Err(`Failed to extract 'intraPosition' value.`);
	}
	const intraPosition = parseInt(intraPositionText, 10);
	if (isNaN(intraPosition)) {
		return Err(`Failed to parse 'intraPosition' value.`);
	}

	const ratingText =
		cardElement._div?.[0]?._div?.[0]?._div?.[0]?._div?.[1]?._span?.[0]?.content?.[0];
	if (typeof ratingText !== 'string') {
		return Err(`Failed to extract 'rating' value.`);
	}
	const rating = parseFloat(ratingText.trim().slice(0, 3));
	if (isNaN(rating)) {
		return Err(`Failed to parse 'rating' value.`);
	}

	const totalReviewsText = cardElement._div?.[0]?._div?.[0]?._div?.[0]?._div?.[1]?._span?.[2]?.text;
	if (totalReviewsText == null) {
		return Err(`Failed to extract 'totalReviews' value.`);
	}
	const totalReviews = parseInt(totalReviewsText.trim().slice(1, -1).replace(',', ''));
	if (isNaN(totalReviews)) {
		return Err(`Failed to parse 'totalReviews' value.`);
	}

	const pricingInfo = cardElement._div?.[0]?._div?.[0]?._div?.[0]?._div?.[1]?._span?.[5]?.text;
	if (pricingInfo == null) {
		return Err(`Failed to extract 'pricingInfo' value.`);
	}

	const description = cardElement?._div?.[0]?._div?.[0]?._div?.[0]?._div?.[2]?.text;
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
		// cardElement // For debugging
	});
}
