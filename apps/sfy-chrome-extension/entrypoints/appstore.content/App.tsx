import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@repo/ui';
import React from 'react';

import { Launcher } from './components';
import { SHADOW_ROOT_NAME } from './index';

export const App: React.FC = () => {
	const onClick = React.useCallback(async () => {
		const res = await browser.runtime.sendMessage('ping');

		console.log(res); // "pong"

		// const shopifyResult = await fetch(
		// 	'https://apps.shopify.com/search?page=1&q=review',
		// 	{
		// 		headers: {
		// 			'Accept': 'text/html, application/xhtml+xml',
		// 			'Turbo-Frame': 'search_page'
		// 		}
		// 	}
		// );
		// const shopifyHtml = await shopifyResult.text();

		// console.log('Hello background!', { id: browser.runtime.id, shopifyHtml });
	}, []);

	return (
		<div className="z-[9999]">
			<Dialog>
				<Launcher />
				<DialogContent
					portalProps={{
						container:
							document.querySelector(SHADOW_ROOT_NAME)?.shadowRoot?.querySelector('body') ??
							undefined
					}}
					overlayProps={{ className: 'z-[9998]' }}
					className="z-[9999]"
				>
					<DialogHeader>
						<DialogTitle>Hello world</DialogTitle>
						<DialogDescription>This is a test</DialogDescription>
						<Button onClick={onClick}>Submit</Button>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default App;
