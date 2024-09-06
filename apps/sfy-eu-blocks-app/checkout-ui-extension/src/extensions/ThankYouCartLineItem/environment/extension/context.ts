import {
	CartLineItemApi,
	OrderConfirmationApi,
	StandardApi
} from '@shopify/ui-extensions/checkout';
import { createState } from 'feature-react/state';

import { appConfig } from '..';

export const $extensionContext = createState<
	(OrderConfirmationApi & CartLineItemApi & StandardApi<typeof appConfig.target>) | null
>(null);

export function cx(): OrderConfirmationApi &
	CartLineItemApi &
	StandardApi<typeof appConfig.target> {
	const extensionContext = $extensionContext.get();

	if (extensionContext == null) {
		throw new Error('No extension api found.');
	}

	return extensionContext;
}
