import { serve } from '@hono/node-server';
import { errorHandler, invalidPathHandler } from '@repo/api-utils';
import { Hono } from 'hono';

(async () => {
	// Only load .env in development and before loading the app
	const nodeEnv = process.env.NODE_ENV ?? 'local';
	if (nodeEnv === 'local') {
		const dotenv = await import('dotenv');
		dotenv.config({ path: `.env.${nodeEnv}` });
		console.log(`Loaded dotenv from '.env.${nodeEnv}'.`);
	}

	const port = 8787;
	const app = new Hono();

	app.onError(errorHandler);
	app.notFound(invalidPathHandler);

	// Append Shopify API router
	const { createApp: createShopifyRoute, logger: shopifyLogger } = await import('./src');
	app.route('/v1/shopify', createShopifyRoute());
	shopifyLogger.info(`Initialized Shopify API at http://localhost:${port.toString()}/v1/shopify`);

	console.info(`Server is running at http://localhost:${port.toString()}`);

	serve({
		fetch: app.fetch,
		port
	});
})();
