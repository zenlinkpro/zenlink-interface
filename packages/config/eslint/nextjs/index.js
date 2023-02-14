// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    '@antfu/eslint-config-react',
    'next',
  ],
  plugins: ['testing-library'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
  },
}

module.exports = eslintConfig
