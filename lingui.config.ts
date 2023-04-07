// @ts-check
/** @type {import('@lingui/conf').LinguiConfig} */
const linguiConfig = {
  catalogs: [
    {
      path: '<rootDir>/packages/locales/{locale}',
      include: ['<rootDir>/apps', '<rootDir>/packages'],
      exclude: ['**/node_modules/**'],
    },
  ],
  compileNamespace: 'cjs',
  fallbackLocales: {
    default: 'en-US',
  },
  format: 'po',
  formatOptions: {
    lineNumbers: false,
  },
  locales: [
    'af-ZA',
    'ar-SA',
    'ca-ES',
    'de-DE',
    'en-US',
    'es-ES',
    'fr-FR',
    'it-IT',
    'ja-JP',
    'ko-KR',
    'ru-RU',
    'zh-CN',
    'zh-TW',
  ],
  orderBy: 'messageId',
  rootDir: '.',
  runtimeConfigModule: ['@lingui/core', 'i18n'],
  sourceLocale: 'en-US',
  pseudoLocale: 'pseudo',
}

export default linguiConfig
