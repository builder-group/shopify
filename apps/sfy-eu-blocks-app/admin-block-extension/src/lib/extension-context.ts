import type { ApiForRenderExtension } from '@shopify/ui-extensions/admin';
import { createState } from 'feature-react/state';

import { appConfig } from '../environment';

export const $extensionContext = createState<ApiForRenderExtension<typeof appConfig.target> | null>(
	null
);

export function getExtensionContext(): ApiForRenderExtension<typeof appConfig.target> {
	const extensionContext = $extensionContext.get();

	if (extensionContext == null) {
		throw new Error('No extension api found.');
	}

	return extensionContext;
}
