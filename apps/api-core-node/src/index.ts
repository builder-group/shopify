import { serve } from '@hono/node-server';
import { Hono } from 'hono';

(async () => {
	// Only load .env in development and before loading the app
	const nodeEnv = process.env.NODE_ENV ?? 'local';
	if (nodeEnv === 'local') {
		const dotenv = await import('dotenv');
		dotenv.config({ path: `.env.${nodeEnv}` });
		console.info(`Loaded dotenv from '.env.${nodeEnv}'.`);
	}

	const port = 8787;
	const app = new Hono();

	// Append Shopify API router
	const { createApp: createShopifyRoute, logger: shopifyLogger } = await import(
		'@repo/api-shopify'
	);
	app.route('/v1/shopify', createShopifyRoute());
	shopifyLogger.info(`Initialized Shopify API at '/v1/shopify'`);

	// Append Energy Label API router
	// TODO:

	console.info(`Server is running on port ${port.toString()}`);

	serve({
		fetch: app.fetch,
		port
	});
})().catch((e: unknown) => {
	console.error('Failed to start server by exception: ', e);
});
