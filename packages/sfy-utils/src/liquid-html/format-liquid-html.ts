import * as prettier from 'prettier';

import { prettierPluginLiquid, type AST } from './prettier-plugin-liquid';

export async function formatLiquidHtml(
	source: string,
	astCallback?: (ast: AST.LiquidHtmlNode) => AST.LiquidHtmlNode
): Promise<string> {
	return prettier.format(source, {
		parser: 'liquid-html',
		plugins: [
			{
				...prettierPluginLiquid,
				parsers: {
					'liquid-html': {
						...prettierPluginLiquid.parsers['liquid-html'],
						async parse(text, options) {
							const ast = await prettierPluginLiquid.parsers['liquid-html'].parse(text, options);
							return astCallback != null ? astCallback(ast) : ast;
						}
					}
				}
			}
		]
	});
}
