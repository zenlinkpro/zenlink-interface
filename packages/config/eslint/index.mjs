import antfu from '@antfu/eslint-config'
import pluginNext from '@next/eslint-plugin-next'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default antfu(
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
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'next': pluginNext,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'no-template-curly-in-string': 'off',
      'no-use-before-define': 'off',
      'ts/no-empty-function': 'off',
      'ts/no-use-before-define': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react/prop-types': 'off',
      'react/jsx-sort-props': 'error',
      'no-mixed-operators': 'off',
      'max-statements-per-line': ['error', { max: 2 }],
      'no-restricted-globals': 'off',
      'ts/no-unsafe-declaration-merging': 'off',
      'node/prefer-global/process': 'off',
      'prefer-arrow-callback': 'off',
      'antfu/consistent-list-newline': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/jsx-indent': 'off',
      'regexp/no-unused-capturing-group': 'off',
      'curly': 'off', // use antfu/curly
      'simple-import-sort/exports': 'error',
      'ts/no-unused-expressions': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },
)
