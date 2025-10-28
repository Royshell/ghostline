/* eslint.config.js (CommonJS version) */
const path = require('node:path');
const vuePlugin = require('eslint-plugin-vue');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const unusedImports = require('eslint-plugin-unused-imports');
const prettierPlugin = require('eslint-plugin-prettier');
const vueParser = require('vue-eslint-parser');
const tsParser = require('@typescript-eslint/parser');

const root = __dirname;

module.exports = [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.output/**',
      '**/.next/**',
      '**/.nuxt/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/.vite/**',
      '**/*.d.ts.map',
    ],
  },

  // Vue SFCs (app + vue package)
  {
    files: ['apps/vue-playground/**/*.vue', 'packages/vue/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: { ts: tsParser },
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: root,
        project: [
          path.join(root, 'apps/vue-playground/tsconfig.app.json'),
          path.join(root, 'packages/vue/tsconfig.json'),
        ],
      },
    },
    plugins: {
      vue: vuePlugin,
      prettier: prettierPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-components': 'warn',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'prettier/prettier': ['error', { singleQuote: true, quoteProps: 'preserve' }], 
      'quote-props': ['error', 'consistent'] 
    },
  },

  // Frontend TS/TSX (app code)
  {
    files: ['apps/vue-playground/src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: root,
        project: [path.join(root, 'apps/vue-playground/tsconfig.app.json')],
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      'unused-imports': unusedImports,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },

  // Frontend Node config files (vite.config.ts)
  {
    files: ['apps/vue-playground/vite.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: root,
        project: [path.join(root, 'apps/vue-playground/tsconfig.node.json')],
      },
    },
    plugins: { '@typescript-eslint': tsEslintPlugin, prettier: prettierPlugin },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
    },
  },

  // Packages TS (core/react/vue)
  {
    files: [
      'packages/core/**/*.ts',
      'packages/react/**/*.{ts,tsx}',
      'packages/vue/**/*.ts',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: root,
        project: [
          path.join(root, 'packages/core/tsconfig.json'),
          path.join(root, 'packages/react/tsconfig.json'),
          path.join(root, 'packages/vue/tsconfig.json'),
        ],
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
      'unused-imports': unusedImports,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, quoteProps: 'preserve' }],
      'quote-props': ['error', 'consistent'],
      '@typescript-eslint/no-unsafe-assignment': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },
];
