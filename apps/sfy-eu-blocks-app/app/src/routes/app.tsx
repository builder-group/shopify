import { json, type HeadersFunction, type LinksFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { NavMenu } from '@shopify/app-bridge-react';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import { AppProvider } from '@shopify/shopify-app-remix/react';
import { boundary } from '@shopify/shopify-app-remix/server';

import { shopifyConfig } from '../environment';
import { authenticate } from '../shopify.server';
import { type TJsonLoaderFunction } from '../types';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const headers: HeadersFunction = (headersArgs) => {
	return boundary.headers(headersArgs);
};

export const loader: TJsonLoaderFunction<{
	apiKey: string;
}> = async ({ request }) => {
	await authenticate.admin(request);

	return json({ apiKey: shopifyConfig.apiKey });
};

const Page: React.FC = () => {
	const { apiKey } = useLoaderData<typeof loader>();

	return (
		<AppProvider isEmbeddedApp apiKey={apiKey}>
			<NavMenu>
				<Link to="/app" rel="home">
					Home
				</Link>
				<Link to="/app/additional">Additional page</Link>
			</NavMenu>
			<Outlet />
		</AppProvider>
	);
};

export default Page;

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary(): JSX.Element {
	return boundary.error(useRouteError());
}
