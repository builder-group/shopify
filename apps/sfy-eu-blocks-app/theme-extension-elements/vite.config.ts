import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';
import solid from 'vite-plugin-solid';

export default defineConfig({
	build: {
		minify: true,
		cssMinify: true,
		rollupOptions: {
			output: {
				manualChunks: {
					solid: ['solid-js', 'solid-element']
				}
			}
		}
	},
	plugins: [
		shopify({
			themeRoot: '../theme-extension',
			// entrypointsDir: "./src",
			additionalEntrypoints: ['./src/elements/EnergyLabel.tsx'],
			sourceCodeDir: './src',
			snippetFile: 'vite-tag.liquid'
		}),
		solid()
	]
});
