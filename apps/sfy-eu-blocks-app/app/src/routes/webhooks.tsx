import type { ActionFunctionArgs } from '@remix-run/node';

import { apiCoreSessionStorage, authenticate } from '../shopify.server';

export const action = async ({ request }: ActionFunctionArgs): Promise<void> => {
	const { topic, shop, session, admin } = await authenticate.webhook(request);

	if (admin == null && topic !== 'SHOP_REDACT') {
		// The admin context isn't returned if the webhook fired after a shop was uninstalled.
		// The SHOP_REDACT webhook will be fired up to 48 hours after a shop uninstalls the app.
		// Because of this, no admin context is available.
		throw new Response();
	}

	// The topics handled here should be declared in the shopify.app.toml.
	// More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
	switch (topic) {
		case 'APP_UNINSTALLED':
			if (session != null) {
				const sessions = await apiCoreSessionStorage.findSessionsByShop(shop);
				await apiCoreSessionStorage.deleteSessions(sessions.map((s) => s.id));
			}
			break;
		case 'CUSTOMERS_DATA_REQUEST':
		case 'CUSTOMERS_REDACT':
		case 'SHOP_REDACT':
		default:
			throw new Response('Unhandled webhook topic', { status: 404 });
	}

	throw new Response();
};
