const { defineConfig } = require("eslint/config");
const js = require("@eslint/js");
const globals = require("globals");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = defineConfig([

  {
    ignores: ["playwright-report/**"]
  },
  // 1) JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [ js.configs.recommended ],                     // built-in JS rules
    languageOptions: {
      globals: globals.browser,
    },
  },

  // 2) TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,                                     // use the TS parser
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,                       // long name
      ts: tsPlugin,                                         // short alias
    },
    rules: {
      // core ESLint rules tweaked for TS:
      ...tsPlugin.configs["eslint-recommended"].rules,
      // full TS-specific recommended rules:
      ...tsPlugin.configs.recommended.rules,
    },
  },
]);
