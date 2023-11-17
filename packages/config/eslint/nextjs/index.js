const antfu = require('@antfu/eslint-config').default
const reacthooks = require('eslint-plugin-react-hooks')
const eslintnext = require('@next/eslint-plugin-next')

module.exports = antfu(
  {
    ignores: [
      '**/__tests__/*.test.ts',
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
    typescript: true,
  },
  {
    plugins: {
      'react-hooks': reacthooks,
      eslintnext,
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
      'prefer-arrow-callback': 'off',
      'antfu/consistent-list-newline': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/jsx-indent': 'off',
    },
  },
)
