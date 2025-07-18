import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    files: ['src/**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: [
      'js/recommended',
    ],
  },
  {
    files: ['src/**/*.js'],
    languageOptions: { sourceType: 'script' },
  },
  {
    files: ['src/**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
		rules: {
			quotes: ['error', 'single']
		},
	},
  globalIgnores(['dist/*']),
  eslintConfigPrettier,
]);
