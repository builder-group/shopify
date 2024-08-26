import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { login } from '../../shopify.server';
import { type TJsonLoaderFunction } from '../../types';
import styles from './styles.module.css';

export const loader: TJsonLoaderFunction<{ showForm: boolean }> = async ({ request }) => {
	const url = new URL(request.url);

	if (url.searchParams.get('shop')) {
		throw redirect(`/app?${url.searchParams.toString()}`);
	}

	return json({ showForm: Boolean(login) });
};

const Page: React.FC = () => {
	const { showForm } = useLoaderData<typeof loader>();

	return (
		<div className={styles.index}>
			<div className={styles.content}>
				<h1 className={styles.heading}>A short heading about [your app]</h1>
				<p className={styles.text}>
					A tagline about [your app] that describes your value proposition.
				</p>
				{showForm ? (
					<Form className={styles.form} method="post" action="/auth/login">
						<label className={styles.label}>
							<span>Shop domain</span>
							<input className={styles.input} type="text" name="shop" />
							<span>e.g: my-shop-domain.myshopify.com</span>
						</label>
						<button className={styles.button} type="submit">
							Log in
						</button>
					</Form>
				) : null}
				<ul className={styles.list}>
					<li>
						<strong>Product feature</strong>. Some detail about your feature and its benefit to your
						customer.
					</li>
					<li>
						<strong>Product feature</strong>. Some detail about your feature and its benefit to your
						customer.
					</li>
					<li>
						<strong>Product feature</strong>. Some detail about your feature and its benefit to your
						customer.
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Page;