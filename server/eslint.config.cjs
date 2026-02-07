const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  prettier,

  // JS / MJS files
  {
    files: ['**/*.js', '**/*.mjs'],
    ignores: ['node_modules/**', '.next/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': 'warn',
    },
  },

  // CJS files
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

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/**', '.next/**'],
    languageOptions: {
      parser: '@typescript-eslint/parser', // parser goes inside languageOptions
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'), // register plugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
    },
  },
];
