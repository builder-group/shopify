/**
 * Merge custom Tailwind configuration with base configuration for `@repo/ui`.
 * @param {object} tailwindConfig - Custom Tailwind config object
 * @return {object} Merged config object
 */
function withRepoUiTailwind(tailwindConfig) {
	const baseConfig = require('./tailwind.config.js');

	return {
		...tailwindConfig,
		withDynUi: true,
		content: [
			...(tailwindConfig?.content ?? []),
			'./node_modules/@repo/ui/dist/esm/components/**/*.{js,ts,jsx,tsx}'
		],
		presets: [...(tailwindConfig?.presets ?? []), baseConfig]
	};
}

module.exports = withRepoUiTailwind;
