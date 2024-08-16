import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ['@wxt-dev/module-react'],
	outDir: 'dist',
	manifest: {
		// https://wxt.dev/guide/key-concepts/manifest.html#action-without-popup
		action: {
			default_title: 'Click to show an alert'
		},
		// https://www.youtube.com/watch?v=yC7RvrsgLCI
		host_permissions: ['*://apps.shopify.com/*']
	}
});
