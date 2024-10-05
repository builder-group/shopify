import * as AST from '@shopify/liquid-html-parser';
import untypedPrettierPluginLiquid from '@shopify/prettier-plugin-liquid';
import {
	type Parser,
	type Printer,
	type RequiredOptions,
	type SupportLanguage,
	type SupportOptions
} from 'prettier';

export const prettierPluginLiquid: TPrettierPluginLiquid = untypedPrettierPluginLiquid;

export interface TPrettierPluginLiquid {
	languages: SupportLanguage[];
	parsers: {
		'liquid-html': Parser<AST.LiquidHtmlNode>;
	};
	printers: {
		'liquid-html-ast': Printer<AST.LiquidHtmlNode>;
	};
	options: SupportOptions;
	defaultOptions: Partial<RequiredOptions>;
}

export { AST };
