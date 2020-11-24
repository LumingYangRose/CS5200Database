module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: {
		// "eslint:recommended",
		"prettier",
	},
	parserOption: {
		ecmaVersion: 2018,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		indent: ["warn", 2, { SwitchCase: 1 }],
		"linbreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"no-console":0
	},
};