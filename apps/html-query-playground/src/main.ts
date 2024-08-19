import { finder } from '@medv/finder';
import { Bench } from 'tinybench';
import { xmlToSimplifiedObject } from 'xml-tokenizer';

await querySearchHtml();
// await queryHtmlBench();

async function querySearchHtml() {
	await applyPublicHtml('search');

	const appCardElements = document.querySelectorAll('div[data-controller="app-card"]');

	// Loox Ad
	appCardElements[1].addEventListener('click', (event) => {
		const selector = finder(event.target as any, {
			root: appCardElements[0]
			// className: () => false
		});
		console.log(selector);
	});

	// Loox
	appCardElements[4].addEventListener('click', (event) => {
		const selector = finder(event.target as any, {
			root: appCardElements[5]
			// className: () => false
		});
		console.log(selector);
	});

	const results: any[] = [];

	for (const cardElement of appCardElements) {
		const isAd = cardElement.querySelector('.tw-rounded-xl')?.textContent?.trim() === 'Ad';
		const builtForShopify = !!cardElement.querySelector('.built-for-shopify-badge');
		const description = cardElement.querySelector('.tw-text-fg-tertiary')?.textContent?.trim();
		const totalReviewsText = cardElement
			.querySelector(isAd ? 'span:nth-child(4)' : 'span:nth-child(3)')
			?.textContent?.trim()
			.slice(1, -1)
			.replace(',', '');
		const totalReviews = totalReviewsText != null ? parseInt(totalReviewsText) : 0;
		const ratingText = cardElement
			.querySelector(isAd ? '.tw-relative > span:nth-child(2)' : '.tw-relative > span:nth-child(1)')
			?.textContent?.trim()
			.slice(0, 3);
		const rating = ratingText != null ? parseFloat(ratingText) : 0;
		const pricingInfo = cardElement
			.querySelector(isAd ? '.tw-text-ellipsis' : '.tw-whitespace-nowrap')
			?.textContent?.trim();
		const isInstalled =
			cardElement.querySelector('.tw-text-notifications-success-primary')?.textContent ===
			'Installed';

		results.push({
			isAd,
			description,
			builtForShopify,
			totalReviews,
			rating,
			pricingInfo,
			isInstalled
		});
	}

	console.log(results);
}

async function queryHtmlBench() {
	const html = await applyPublicHtml('search-item');
	const bench = new Bench({ time: 100 });

	bench
		.add('xpath', () => {
			const parser = new DOMParser();
			const document = parser.parseFromString(html, 'text/html');
			const rating = document.evaluate(
				'//*[@id="app"]/div/div/div[1]/div[1]/div[2]/span[1]',
				document,
				null,
				XPathResult.STRING_TYPE,
				null
			);
			console.log('XPath: ', rating.stringValue);
		})
		.add('querySelector', () => {
			const parser = new DOMParser();
			const document = parser.parseFromString(html, 'text/html');
			const ratingElement = document.querySelector(
				'#app > div > div > div > div > div > span:nth-child(1)'
			);
			console.log('QuerySelector: ', ratingElement?.textContent);
		})
		.add('xmlTokenizer', () => {
			const simplifiedObject = xmlToSimplifiedObject(html);
			console.log(
				simplifiedObject._div[0]._div[0]._figure[0]._div[0]._div[0]._div[1]._span[0].content?.[0]
			);
		});

	await bench.warmup();
	await bench.run();

	console.table(bench.table());
}

async function applyPublicHtml(name: string): Promise<string> {
	const htmlResult = await fetch(`http://localhost:5173/${name}.html`);
	const html = await htmlResult.text();

	document.querySelector<HTMLDivElement>('#app')!.innerHTML = html;

	for (const svgElement of document.querySelectorAll('svg')) {
		svgElement.setAttribute('height', '25');
		svgElement.setAttribute('width', '25');
	}

	return html;
}
