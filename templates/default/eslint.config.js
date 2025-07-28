import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        files: ['**/*.ts', '**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.builtin,
                ...globals.nodeBuiltin,
            },
            parserOptions: {
                parser: tseslint.parser,
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
        },
    },
    {
        rules: {
            semi: 'error',
            'prefer-const': 'error',
            'no-duplicate-imports': 'error',
            'no-constant-condition': 'error',
            'no-unreachable': 'error',
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            camelcase: ['error', { properties: 'never' }],
            curly: ['error', 'multi-line'],
            eqeqeq: ['error', 'always'],
            'no-var': 'error',
            'prefer-template': 'error',
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true,
                },
            ],
            'array-bracket-spacing': ['error', 'never'],
            'arrow-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                },
            ],
            'block-spacing': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                },
            ],
            indent: [
                'error',
                4,
                {
                    SwitchCase: 2,
                    VariableDeclarator: 2,
                    outerIIFEBody: 2,
                },
            ],
            'key-spacing': [
                'error',
                {
                    beforeColon: false,
                    afterColon: true,
                },
            ],
            'keyword-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                },
            ],
            'max-len': [
                'error',
                {
                    code: 110,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                    maxEOF: 1,
                },
            ],
            'eol-last': ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/consistent-type-imports': 'warn',
        },
    },
    {
        ignores: ['node_modules/', '**/node_modules/', '/**/node_modules/*', 'prettier.config.cjs'],
    },
);

