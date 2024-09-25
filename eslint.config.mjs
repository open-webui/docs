// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
// import docusaurus from '@docusaurus/eslint-plugin'; // https://github.com/facebook/docusaurus/issues/10490

export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	// docusaurus.configs.recommended, // https://github.com/facebook/docusaurus/issues/10490
	{
		files: ["*.ts", "*.tsx", "*.js", "*.mjs", "*.cjs"],
		ignores: [],
		rules: {},
	},
];
