# Contributing to project-shopify

We are open and grateful for any contribution made by the community. If you're interested in contributing to project-shopify, this document might make the process for you easier.

The [Open Source Guides](https://opensource.guide/) website has a collection of resources for individuals,
communities, and companies who want to learn how to run and contribute to an open-source project.
Contributors and people new to open source will find the following guides especially useful:

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Building Welcoming Communities](https://opensource.guide/building-community/)

## 👊 [Code of Conduct](https://code.fb.com/codeofconduct)

Please read [the full text](https://code.fb.com/codeofconduct), so that you are able to understand what interpersonal actions will and will not be tolerated.

## 🌟 Style Guide

### `package.json` structure

The structure of the `package.json` file in this project should adhere to a specific format, as illustrated by the example structure below. This structure is based on the [npm documentation for creating a `package.json` file](https://docs.npmjs.com/creating-a-package-json-file).

```json
{
	"name": "@repo/example",
	"version": "0.0.1",
	"description": "Description of the package",
	"private": true,
	"scripts": {
		"build": "shx rm -rf dist && ../../scripts/cli.sh bundle",
		"start:dev": "tsc -w",
		"lint": "eslint --ext .js,.ts src/",
		"clean": "shx rm -rf dist && shx rm -rf node_modules && shx rm -rf .turbo",
		"install:clean": "pnpm run clean && pnpm install",
		"test": "echo \"Error: no test specified\" && exit 1",
		"update:latest": "pnpm update --latest"
	},
	// "type": "module",
	// "source": "./src/index.ts",
	// "main": "./dist/cjs/index.js",
	// "module": "./dist/esm/index.js",
	// "types": "./dist/types/index.d.ts",
	"repository": {
		"type": "git",
		"url": "https://github.com/builder-group/project-shopify.git"
	},
	"keywords": [],
	"author": "@bennoinbeta",
	"license": "AGPL-3.0-or-later",
	"bugs": {
		"url": "https://github.com/builder-group/project-shopify/issues"
	},
	"homepage": "",
	"dependencies": {
		// Project dependencies here
	},
	"peerDependencies": {
		// Project peerDependencies here
	},
	"devDependencies": {
		// Project devDependencies here
	},
	"files": ["dist", "README.md"]
}
```

For specific packages, additional fields should be included as shown below. Note that the fields `source`, `main`, `module`, `types`, and `files` are usually required in packages:

```json
{
	// ..
	// "scripts": ..,
	"source": "./src/index.ts", // Entry file (source code)
	"main": "./dist/cjs/index.js", // Entry point (CommonJS)
	"module": "./dist/esm/index.js", // Entry point (ES Module)
	"types": "./dist/types/index.d.ts", // Type definitions
	// ..
	// "devDependencies": {},
	"files": [
		// List of files to be included in your package
	]
}
```

## 📄 License

By contributing to project shopify, you agree that your contributions will be licensed under the license defined in [`LICENSE.md`](./LICENSE.md).

## 🎉 Credits

- [Docusaurus `CONTRIBUTING.md`](https://github.com/facebook/docusaurus/blob/master/CONTRIBUTING.md)
