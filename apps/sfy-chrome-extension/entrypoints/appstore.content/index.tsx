import ReactDOM from 'react-dom/client';

import App from './App';

import './style.css';

export const SHADOW_ROOT_NAME = 'bg-appstore-chrome-extension';

export default defineContentScript({
	matches: ['*://apps.shopify.com/*'],
	cssInjectionMode: 'ui',

	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: SHADOW_ROOT_NAME,
			position: 'inline',
			anchor: 'body',
			append: 'last',
			onMount: (container) => {
				const app = document.createElement('div');
				container.append(app);

				// Create a root on the UI container and render a component
				const root = ReactDOM.createRoot(app);
				root.render(<App />);
				return root;
			},
			onRemove: (root) => {
				// Unmount the root when the UI is removed
				root?.unmount();
			}
		});

		// 4. Mount the UI
		ui.mount();
	}
});
