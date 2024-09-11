import { readFile } from 'node:fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';

import { AST, formatLiquidHtml } from '../liquid-html';

describe('playground', () => {
	let liquid = '';

	beforeAll(async () => {
		liquid = await readFile(`${__dirname}/resources/simple.liquid`, 'utf-8');
	});

	it('should work', async () => {
		const result = await formatLiquidHtml(liquid, (ast) => {
			const newParagraphNode = AST.toLiquidHtmlAST('<p>Hello World</p>')
				.children[0] as unknown as AST.LiquidHtmlNode;

			function insertAfterImg(node: AST.LiquidHtmlNode): AST.LiquidHtmlNode {
				if ('children' in node && node.children != null) {
					for (let i = 0; i < node.children.length; i++) {
						const child = node.children[i] as unknown as AST.LiquidHtmlNode;

						// Check if the child is an HtmlVoidElement (which includes <img>)
						if (child.type === AST.NodeTypes.HtmlVoidElement && child.name === 'img') {
							node.children.splice(i + 1, 0, newParagraphNode);
						}

						insertAfterImg(child);
					}
				}

				return node;
			}

			return insertAfterImg(ast);
		});

		console.log(result);

		expect(result).not.toBeNull();
	});
});
