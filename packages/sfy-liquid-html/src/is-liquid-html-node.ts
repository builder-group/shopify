import { AST } from './prettier-plugin-liquid';

export function isLiquidHtmlNode(value: unknown): value is AST.LiquidHtmlNode {
	return (
		value != null &&
		typeof value === 'object' &&
		'type' in value &&
		Object.prototype.hasOwnProperty.call(AST.NodeTypes, value.type as any)
	);
}
