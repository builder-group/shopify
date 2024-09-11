import { formatLiquidHtml } from './format-liquid-html';
import { AST } from './prettier-plugin-liquid';

export async function formatLiquidHtmlWithInsertions(
	source: string,
	insertionRules: TInsertionRule[]
): Promise<string> {
	return formatLiquidHtml(source, {
		astMiddleware: (ast) => applyInsertionRules(ast, insertionRules)
	});
}

function applyInsertionRules(ast: AST.LiquidHtmlNode, rules: TInsertionRule[]): AST.LiquidHtmlNode {
	function traverseAndInsert(node: AST.LiquidHtmlNode): AST.LiquidHtmlNode {
		if ('children' in node && Array.isArray(node.children)) {
			const newChildren: AST.LiquidHtmlNode[] = [];

			for (const child of node.children) {
				for (const rule of rules) {
					if (rule.criteria(child)) {
						// Use children of parsed rule content because root node is always Document node
						const newContent = AST.toLiquidHtmlAST(rule.content).children;

						if (rule.position === 'before') {
							newChildren.push(...newContent);
						} else if (
							rule.position === 'prepend' &&
							'children' in child &&
							Array.isArray(child.children)
						) {
							child.children.unshift(...newContent);
						}
					}
				}

				newChildren.push(traverseAndInsert(child));

				for (const rule of rules) {
					if (rule.criteria(child)) {
						// Use children of parsed rule content because root node is always Document node
						const newContent = AST.toLiquidHtmlAST(rule.content).children;

						if (rule.position === 'after') {
							newChildren.push(...newContent);
						} else if (
							rule.position === 'append' &&
							'children' in child &&
							Array.isArray(child.children)
						) {
							child.children.push(...newContent);
						}
					}
				}
			}

			node.children = newChildren;
		}

		return node;
	}

	return traverseAndInsert(ast);
}

export type TInsertionCriteria = (node: AST.LiquidHtmlNode) => boolean;
export type TInsertionPosition = 'before' | 'after' | 'prepend' | 'append';

export interface TInsertionRule {
	criteria: TInsertionCriteria;
	content: string;
	position: TInsertionPosition;
}
