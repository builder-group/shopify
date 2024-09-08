import { readFile } from 'node:fs/promises';
import { toLiquidHtmlAST } from '@shopify/liquid-html-parser';
import { beforeAll, describe, expect, it } from 'vitest';

describe('playground', () => {
	let liquid = '';

	beforeAll(async () => {
		liquid = await readFile(`${__dirname}/resources/simple.liquid`, 'utf-8');
	});

	it('should work', () => {
		const ast = toLiquidHtmlAST(liquid);

		expect(ast).not.toBeNull();
	});
});
