import { type coreApiV1 } from '@repo/types/api';
import { Hono } from 'hono';
import { createHonoOpenApiRouter } from '@blgc/openapi-router';

export const router = new Hono();

export const openApiRouter = createHonoOpenApiRouter<coreApiV1.paths>(router);
