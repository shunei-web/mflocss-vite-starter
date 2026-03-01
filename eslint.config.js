import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
];
