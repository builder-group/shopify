import * as prettier from 'prettier';

import { prettierPluginLiquid, type AST } from './prettier-plugin-liquid';

export async function formatLiquidHtml(
	source: string,
	options: TFormatLiquidHtmlOptions = {}
): Promise<string> {
	const { astMiddleware } = options;

	return prettier.format(source, {
		parser: 'liquid-html',
		plugins: [
			{
				...prettierPluginLiquid,
				parsers: {
					'liquid-html': {
						...prettierPluginLiquid.parsers['liquid-html'],
						async parse(text, parseOptions) {
							const ast = await prettierPluginLiquid.parsers['liquid-html'].parse(
								text,
								parseOptions
							);
							return astMiddleware != null ? astMiddleware(ast) : ast;
						}
					}
				}
			}
		]
	});
}

export interface TFormatLiquidHtmlOptions {
	astMiddleware?: (ast: AST.LiquidHtmlNode) => AST.LiquidHtmlNode;
}
