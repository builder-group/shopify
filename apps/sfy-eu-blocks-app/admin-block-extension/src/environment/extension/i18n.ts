import { $extensionContext } from './context';

export function t<GTranslationKey extends TTranslationKeys>(
	key: GTranslationKey,
	options?: GTranslationKey extends keyof TTranslationOptions
		? TTranslationOptions[GTranslationKey]
		: Record<string, never>
): string {
	const extensionContext = $extensionContext.get();
	if (extensionContext == null) {
		throw new Error('No extension api found.');
	}
	return extensionContext.i18n.translate(key, options || {});
}

type TNestedKeyOf<GJson> = GJson extends object
	? {
			[K in keyof GJson]: K extends string ? `${K}` | `${K}.${TNestedKeyOf<GJson[K]>}` : never;
		}[keyof GJson]
	: never;

type TTranslationKeys = TNestedKeyOf<typeof import('../../../locales/en.default.json')>;

type TTranslationOptions = {
	'banner.error.retrievalFailed': { errorMessage: string };
	'banner.error.metafieldsRead': { errorMessage: string };
	'banner.error.metafieldsWrite': { errorMessage: string };
	'banner.error.notFound': { registrationNumber: string };
	'banner.success.energyLabelFound': { productName: string };
	'banner.success.energyLabelUpdated': { productName: string };
	'banner.warning.noDatasheetForLocale.content': { locale: string };
};
