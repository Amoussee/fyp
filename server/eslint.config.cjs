const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  prettier,

  // Default for .js and .mjs: ESM (matches "type": "module")
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: ['node_modules/**', '.next/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // Changed from 'commonjs' to 'module'
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'warn',
    },
  },

  // Only .cjs is CommonJS
  {
    files: ['**/*.cjs'],
    ignores: ['node_modules/**', '.next/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
];
