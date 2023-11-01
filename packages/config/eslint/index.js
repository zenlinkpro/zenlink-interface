const antfu = require('@antfu/eslint-config').default
const reacthooks = require('eslint-plugin-react-hooks')
const eslintnext = require('@next/eslint-plugin-next')

module.exports = antfu(
  {
    stylistic: false,
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.graphclient/**',
      '**/.mesh/**',
      '**/__generated__/**',
      '**/generated/**',
      '**/typechain/**',
      '**/coverage/**',
      '**/exports/**',
    ],
    jsonc: false,
    yaml: false,
  },
  {
    plugins: {
      'react-hooks': reacthooks,
      eslintnext
    },
    rules: {
      'react/display-name': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      'no-template-curly-in-string': 'off',
      'no-use-before-define': 'off',
      'ts/no-empty-function': 'off',
      'ts/no-use-before-define': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off',
      'no-mixed-operators': 'off',
      'max-statements-per-line': ['error', { max: 2 }],
      'no-restricted-globals': 'off',
      'ts/no-unsafe-declaration-merging': 'off',
      'node/prefer-global/process': 'off',
      'prefer-arrow-callback': 'off'
    },
  }
)

// // @ts-check
// /** @type {import('eslint').ESLint.ConfigData} */
// const eslintConfig = {
//   root: true,
//   env: {
//     node: true,
//     browser: true,
//     es6: true,
//   },
//   plugins: ['simple-import-sort', 'unused-imports'],
//   extends: ['@antfu/eslint-config'],
//   ignorePatterns: [
//     '**/__tests__/*.test.ts',
//     '**/dist/**',
//     '**/node_modules/**',
//     '**/.graphclient/**',
//     '**/.mesh/**',
//     '**/generated/**',
//     '**/typechain/**',
//     '**/coverage/**',
//     '**/exports/**',
//   ],
//   rules: {
//     'simple-import-sort/exports': 'warn',
//     'react/display-name': 'off',
//     'unused-imports/no-unused-imports': 'warn',
//     'unused-imports/no-unused-vars': 'warn',
//     'no-unused-vars': 'warn',
//     'no-template-curly-in-string': 'off',
//     'no-use-before-define': 'off',
//     '@typescript-eslint/no-empty-function': 'off',
//     '@typescript-eslint/no-use-before-define': 'off',
//     'react-hooks/exhaustive-deps': 'error',
//     'react/prop-types': 'off',
//     'no-mixed-operators': 'off',
//     'max-statements-per-line': ['error', { max: 2 }],
//     'antfu/top-level-function': 'off',
//     'no-restricted-globals': 'off',
//     '@typescript-eslint/no-unsafe-declaration-merging': 'off',
//     'n/prefer-global/process': 'off',
//   },
// }

// module.exports = eslintConfig
