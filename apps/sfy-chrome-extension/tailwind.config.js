const withRepoUiTailwind = require('@repo/ui/with-tailwind');

module.exports = withRepoUiTailwind(
	/** @type {import('tailwindcss').Config} */
	{
		content: ['assets/**', 'entrypoints/**', 'components/**']
	}
);
