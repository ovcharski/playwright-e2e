import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: [
      'node_modules/**',
      'test-results/**',
      'playwright-report/**',
      'screenshots/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Applies to page objects too, not just specs: no-wait-for-timeout and
    // prefer-locator are just as relevant in pages/ as in tests/.
    ...playwright.configs['flat/recommended'],
    files: ['**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions in this repo live inside Page Object methods named
      // verify*/expect*, which the rule cannot see into. Teaching it those
      // names beats switching the rule off — a test that genuinely asserts
      // nothing still gets flagged.
      'playwright/expect-expect': [
        'warn',
        { assertFunctionPatterns: ['^(verify|expect)'] },
      ],
    },
  },
];
