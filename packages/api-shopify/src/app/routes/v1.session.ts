import { type shopifyApiV1 } from '@repo/types/api';
import { desc, eq, inArray, type InferSelectModel } from 'drizzle-orm';
import * as v from 'valibot';
import { vValidator } from 'validation-adapters/valibot';
import { AppError } from '@blgc/openapi-router';
import { db, schema } from '@/db';

import { openApiRouter } from '../router';

openApiRouter.post('/session', {
	bodyValidator: vValidator(
		v.object({
			id: v.pipe(v.string(), v.nonEmpty()),
			app: v.pipe(v.string(), v.nonEmpty()),
			shop: v.pipe(v.string(), v.nonEmpty()),
			state: v.string(),
			isOnline: v.boolean(),
			scope: v.optional(v.string()),
			expires: v.optional(v.number()),
			accessToken: v.optional(v.string()),
			userId: v.optional(v.number())
		})
	),
	handler: async (c) => {
		const sessionDto = c.req.valid('json');

		const row = sessionDtoToRow(sessionDto);
		await db.insert(schema.shopifySessionTable).values(row).onConflictDoUpdate({
			target: schema.shopifySessionTable.id,
			set: row
		});

		return c.json(true);
	}
});

openApiRouter.get('/session/{id}', {
	pathValidator: vValidator(
		v.object({
			id: v.pipe(v.string(), v.nonEmpty())
		})
	),
	handler: async (c) => {
		const { id } = c.req.valid('param');

		const rows = await db
			.select()
			.from(schema.shopifySessionTable)
			.where(eq(schema.shopifySessionTable.id, id))
			.limit(1);

		if (rows.length <= 0) {
			throw new AppError('#ERR_NOT_FOUND', 404);
		}

		return c.json(rowToSessionDto(rows[0] as InferSelectModel<typeof schema.shopifySessionTable>));
	}
});

openApiRouter.del('/session/{id}', {
	pathValidator: vValidator(
		v.object({
			id: v.pipe(v.string(), v.nonEmpty())
		})
	),
	handler: async (c) => {
		const { id } = c.req.valid('param');

		await db.delete(schema.shopifySessionTable).where(eq(schema.shopifySessionTable.id, id));

		return c.json(true);
	}
});

openApiRouter.post('/session/delete', {
	bodyValidator: vValidator(v.array(v.string())),
	handler: async (c) => {
		const ids = c.req.valid('json');

		await db.delete(schema.shopifySessionTable).where(inArray(schema.shopifySessionTable.id, ids));

		return c.json(true);
	}
});

openApiRouter.get('/session/shop/{shop}', {
	pathValidator: vValidator(
		v.object({
			shop: v.pipe(v.string(), v.nonEmpty())
		})
	),
	handler: async (c) => {
		const { shop } = c.req.valid('param');

		const rows = await db
			.select()
			.from(schema.shopifySessionTable)
			.where(eq(schema.shopifySessionTable.shop, shop))
			.orderBy(desc(schema.shopifySessionTable.expires));

		return c.json(rows.map((row) => rowToSessionDto(row)));
	}
});

function rowToSessionDto(
	row: InferSelectModel<typeof schema.shopifySessionTable>
): shopifyApiV1.components['schemas']['ShopifySessionDto'] {
	return {
		id: row.id,
		app: row.app,
		shop: row.shop,
		state: row.state,
		isOnline: row.isOnline,
		scope: row.scope ?? undefined,
		expires: row.expires?.getTime(),
		accessToken: row.accessToken ?? undefined,
		userId: row.userId ?? undefined
	};
}

function sessionDtoToRow(
	sessionDto: shopifyApiV1.components['schemas']['ShopifySessionDto']
): InferSelectModel<typeof schema.shopifySessionTable> {
	return {
		id: sessionDto.id,
		app: sessionDto.app,
		shop: sessionDto.shop,
		state: sessionDto.state,
		isOnline: sessionDto.isOnline,
		scope: sessionDto.scope ?? null,
		expires: sessionDto.expires != null ? new Date(sessionDto.expires) : null,
		accessToken: sessionDto.accessToken ?? null,
		userId: sessionDto.userId ?? null
	};
}
