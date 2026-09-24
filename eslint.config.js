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
        // Type-aware linting. Needs the TypeScript program, so it only became
        // possible once tsconfig.json landed.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
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
      // Promise safety. missing-playwright-await covers expect() and the test
      // API; it does not cover Page Object methods, and almost every one of
      // those is async. A forgotten await on one fails silently -- the test
      // passes having asserted nothing. These three close that gap.
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
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
