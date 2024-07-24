import { type paths } from '@repo/types/core';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { createHonoOpenApiRouter } from '@ibg/openapi-router';

export const router = new Hono();

router.use('/v1/shopify/*', bearerAuth({ token: 'token' }));

export const openApiRouter = createHonoOpenApiRouter<paths>(router);
