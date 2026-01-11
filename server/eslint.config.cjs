const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  prettier,
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'warn',
    },
  },
];
