/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
	root: true,
	extends: [require.resolve('@ibg/config/eslint/react-internal'), 'plugin:storybook/recommended']
};
