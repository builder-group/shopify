import { ApiForRenderExtension } from '@shopify/ui-extensions/admin';
import { useGlobalState } from 'feature-react/state';

import { appConfig } from '../environment';
import { $extensionContext } from '../lib';

export function useExtensionContext(): ApiForRenderExtension<typeof appConfig.target> {
	const extensionContext = useGlobalState($extensionContext);

	if (extensionContext == null) {
		throw new Error('No extension api found.');
	}

	return extensionContext;
}
