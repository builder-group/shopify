import { json, type LinksFunction } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import {
	Button,
	Card,
	FormLayout,
	AppProvider as PolarisAppProvider,
	Page as PolarisPage,
	Text,
	TextField
} from '@shopify/polaris';
import polarisStyles from '@shopify/polaris/build/esm/styles.css?url';
import polarisTranslations from '@shopify/polaris/locales/en.json';
import { useState } from 'react';

import { login } from '../../shopify.server';
import { type TJsonActionFunction, type TJsonLoaderFunction } from '../../types';
import { loginErrorMessage, type TLoginErrorMessage } from './error.server';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: polarisStyles }];

export const loader: TJsonLoaderFunction<{
	errors: TLoginErrorMessage;
	polarisTranslations: typeof polarisTranslations;
}> = async ({ request }) => {
	const errors = loginErrorMessage(await login(request));

	return json({ errors, polarisTranslations });
};

export const action: TJsonActionFunction<{ errors: TLoginErrorMessage }> = async ({ request }) => {
	const errors = loginErrorMessage(await login(request));

	return json({
		errors
	});
};

const Page: React.FC = () => {
	const loaderData = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const [shop, setShop] = useState('');
	const { errors } = actionData ?? loaderData;

	return (
		<PolarisAppProvider i18n={loaderData.polarisTranslations}>
			<PolarisPage>
				<Card>
					<Form method="post">
						<FormLayout>
							<Text variant="headingMd" as="h2">
								Log in
							</Text>
							<TextField
								type="text"
								name="shop"
								label="Shop domain"
								helpText="example.myshopify.com"
								value={shop}
								onChange={setShop}
								autoComplete="on"
								error={errors.shop}
							/>
							<Button submit>Log in</Button>
						</FormLayout>
					</Form>
				</Card>
			</PolarisPage>
		</PolarisAppProvider>
	);
};

export default Page;
