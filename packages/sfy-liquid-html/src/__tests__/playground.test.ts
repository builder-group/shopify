import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';

import { formatLiquidHtmlWithInsertions } from '../format-liquid-html-with-insertions';
import { AST } from '../prettier-plugin-liquid';

describe('playground', () => {
	let liquidHtml = '';

	beforeAll(async () => {
		liquidHtml = await readFile(`${__dirname}/resources/simple.liquid`, 'utf-8');
	});

	it('should workd', async () => {
		const toInsertLiquidHtml = `
<!-- START: eu-blocks -->
  <div class='eu-blocks eu-blocks_energy-label'>
    {{ card_product.metafields.eu_blocks.energy_label }}
  </div>
<!-- END: eu-blocks -->
`;

		const result = await formatLiquidHtmlWithInsertions(liquidHtml, [
			{
				criteria: (node: AST.LiquidHtmlNode) => {
					if (node.type === AST.NodeTypes.LiquidTag && node.name === 'if') {
						const markup = node.markup as AST.LiquidConditionalExpression;
						if (
							markup.type === AST.NodeTypes.LogicalExpression &&
							markup.relation === 'and' &&
							markup.left.type === AST.NodeTypes.VariableLookup &&
							markup.left.name === 'show_rating'
						) {
							return true;
						}
					}
					return false;
				},
				content: toInsertLiquidHtml,
				position: 'before'
			}
		]);

		console.log(result);

		// await writeFile(`${__dirname}/resources/created.liquid`, result);

		expect(result).not.toBeNull();
	});
});
