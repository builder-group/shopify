const withRepoUiTailwind = require('@repo/ui/with-tailwind');

module.exports = withRepoUiTailwind(
	/** @type {import('tailwindcss').Config} */
	{
		content: [
			'./src/assets/**/*.{css}',
			'./src/entrypoints/**/*.{ts,tsx}',
			'./src/components/**/*.{ts,tsx}'
		]
	}
);
