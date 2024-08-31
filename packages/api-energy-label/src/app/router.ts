import { type energyLabelApiV1 } from '@repo/types/api';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createHonoOpenApiRouter } from '@blgc/openapi-router';

export const router = new Hono();

router.use(
	cors({
		origin: ['https://extensions.shopifycdn.com']
	})
);

export const openApiRouter = createHonoOpenApiRouter<energyLabelApiV1.paths>(router);
