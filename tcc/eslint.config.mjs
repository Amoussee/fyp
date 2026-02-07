import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import next from 'eslint-config-next';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'next-env.d.ts',
    'src/components/react-pivottable/**',
  ]),
  ...nextVitals,
  ...nextTs,
  ...next,
  prettier,
]);

export default eslintConfig;
