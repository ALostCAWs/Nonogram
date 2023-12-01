module.exports = {
	env: {
		browser: true,
		node: true,
		amd: true,
		es2021: true,
	},
	extends: 'eslint:recommended', //'plugin:react/recommended'
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: [
		'react'
	],
	rules: {
		// Enforce Styling
		'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
		'object-curly-spacing': ['warn', 'always'],
		'comma-spacing': [
			'warn',
			{
				before: 'false',
				after: 'true',
			},
		],
		'func-names': ['warn', 'as-needed'],
		'comma-dangle': ['warn', 'only-multiline'], // Allows but doesn't require trailing commas
		'array-bracket-newline': [
			'warn',
			{
				multiline: true,
				minItems: 3,
			},
		],
		'yoda': 'error',
		'lines-around-comment': [
			'warn',
			{
				beforeBlockComment: true,
				afterBlockComment: false,
				beforeLineComment: true,
				afterLineComment: false,
				allowBlockStart: true,
				allowBlockEnd: true,
				allowClassStart: true,
				allowClassEnd: true,
				allowObjectStart: true,
				allowObjectEnd: true,
				allowArrayStart: false,
				allowArrayEnd: false,
				ignorePattern: 'pragma',
				applyDefaultPatterns: true,
			},
		],
		// Avoid duplicates
		'no-self-compare': 'error',
		// Avoid infinites
		//'no-constant-condition': 'off',
		// Avoid unfinished code
		//'no-empty': 'off',
		// Ensure accurate values
		'no-template-curly-in-string': 'error',
		//'no-cond-assign': 'off',
		// Allow debugger & console
		'no-debugger': 'off',
		'no-console': 'off',
		// (turn on when deploying)
		/* 'no-debugger': 'error',
		'no-console': [
			'error',
			{
				// Allow error messages for user-end issue reports
				allow: ['error', 'warn'], // Specify console.error / .warn as allowable methods
			},
		], */
	},
};
