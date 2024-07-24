import { type paths } from '@repo/types/core';
import { Hono } from 'hono';
import { createHonoOpenApiRouter } from '@ibg/openapi-router';

export const router = new Hono();
export const openApiRouter = createHonoOpenApiRouter<paths>(router);
