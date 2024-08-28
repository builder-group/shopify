import { type shopifyApiV1 } from '@repo/types/api';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors';
import { createHonoOpenApiRouter } from '@blgc/openapi-router';

import { appConfig } from '../environment';

export const router = new Hono();

router.use(
	'/session/*',
	cors({ origin: ['https://shopify.com/', 'https://admin.shopify.com/'] }),
	bearerAuth({ token: appConfig.shopifyBearerToken })
);

export const openApiRouter = createHonoOpenApiRouter<shopifyApiV1.paths>(router);
