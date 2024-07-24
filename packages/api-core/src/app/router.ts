import { type paths } from '@repo/types/core';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { createHonoOpenApiRouter } from '@ibg/openapi-router';

import { appConfig } from '../environment';

export const router = new Hono();

router.use('/v1/shopify/*', bearerAuth({ token: appConfig.shopifyBearerToken }));

export const openApiRouter = createHonoOpenApiRouter<paths>(router);
