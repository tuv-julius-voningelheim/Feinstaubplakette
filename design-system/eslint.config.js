import js from '@eslint/js';
import chaiFriendly from 'eslint-plugin-chai-friendly';
import lit from 'eslint-plugin-lit';
import litA11y from 'eslint-plugin-lit-a11y';
import importPlugin from 'eslint-plugin-simple-import-sort';
import wc from 'eslint-plugin-wc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: [
            'coverage',
            'dist',
            'dist-figma',
            'node_modules',
            'storybook-static',
            'package.json',
            'package-lock.json',
            '**/*.yml',
            '**/*.yaml',
            'tsconfig.json',
            'README.md',
        ],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
        },
        plugins: {
            'simple-import-sort': importPlugin,
        },
        rules: {
            indent: 'off',
            quotes: 'off',
            'max-len': 'off',

            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // 1. External libs — value imports (lit, @lit/react, etc.)
                        [
                            '^(?!@utils|@components|@storybook|@tokens|@theme)(\\w|@(?!utils|components|storybook|tokens|theme))',
                        ],
                        // 1b. External libs — type imports
                        [
                            '^(?!@utils|@components|@storybook|@tokens|@theme)(\\w|@(?!utils|components|storybook|tokens|theme)).*\\u0000$',
                        ],
                        // 2. @utils — value then type
                        ['^@utils/', '^@utils/.*\\u0000$'],
                        // 3. @components — value then type
                        ['^@components/', '^@components/.*\\u0000$'],
                        // 4. @storybook, @tokens, @theme — value then type
                        [
                            '^@storybook/',
                            '^@tokens/',
                            '^@theme/',
                            '^@storybook/.*\\u0000$',
                            '^@tokens/.*\\u0000$',
                            '^@theme/.*\\u0000$',
                        ],
                        // 5. Relative non-style — value then type
                        ['^\\.(?!.*Style\\.js)', '^\\.(?!.*Style\\.js).*\\u0000$'],
                        // 6. Relative style files last
                        ['.*Style\\.js', '.*Style\\.js.*\\u0000$'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
        },
    },

    {
        files: ['**/*.{js,ts}'],
        plugins: {
            lit,
            'lit-a11y': litA11y,
            wc,
        },
    },

    {
        files: ['**/*.test.ts'],
        plugins: {
            'chai-friendly': chaiFriendly,
        },
        languageOptions: {
            globals: { ...globals.browser, ...globals.mocha },
        },
        rules: {
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            'chai-friendly/no-unused-expressions': 'error',
        },
    },

    {
        files: ['**/*.{cjs,mjs}'],
        languageOptions: {
            sourceType: 'script',
            globals: globals.node,
        },
    },
];
