import {
	createApp as createEnergyLabelRoute,
	logger as energyLabelLogger
} from '@repo/api-energy-label';
import { createApp as createShopifyRoute, logger as shopifyLogger } from '@repo/api-shopify';
import { errorHandler, invalidPathHandler } from '@repo/api-utils';
import { Hono } from 'hono';
import { logger as loggerMiddleware } from 'hono/logger';

import { appConfig } from '../environment';
import { logger } from '../logger';
import { router } from './router';

import './routes';

export function createApp(app: Hono = new Hono()): Hono {
	app.onError(errorHandler);
	app.notFound(invalidPathHandler);
	app.use(
		loggerMiddleware((str: string, ...rest: string[]) => {
			logger.info(str, rest);
		})
	);

	app.route('/', router);

	// Append Energy Label API router
	app.route('/v1/energy-label', createEnergyLabelRoute());
	energyLabelLogger.info(
		`Initialized Energy Label API at http://localhost:${appConfig.port.toString()}/v1/energy-label`
	);

	// Append Shopify API router
	app.route('/v1/shopify', createShopifyRoute());
	shopifyLogger.info(
		`Initialized Shopify API at http://localhost:${appConfig.port.toString()}/v1/shopify`
	);

	return app;
}
