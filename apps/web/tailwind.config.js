const withRepoUiTailwind = require('@repo/ui/with-tailwind');

module.exports = withRepoUiTailwind(
	/** @type {import('tailwindcss').Config} */
	{
		content: ['./src/components/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}']
	}
);
