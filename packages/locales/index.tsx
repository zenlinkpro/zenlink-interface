import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import {
  af,
  ar,
  ca,
  cs,
  da,
  de,
  el,
  en,
  es,
  fi,
  fr,
  he,
  hu,
  id,
  it,
  ja,
  ko,
  nl,
  no,
  pl,
  pt,
  ro,
  ru,
  sr,
  sv,
  sw,
  tr,
  uk,
  vi,
  zh,
} from 'make-plural/plurals'
import type { PluralCategory } from 'make-plural/plurals'
import type { SupportedLocale } from './config'
import { DEFAULT_LOCALE } from './config'

export { Trans } from '@lingui/macro'

type LocalePlural = {
  [key in SupportedLocale]: (n: number | string, ord?: boolean) => PluralCategory
}

const plurals: LocalePlural = {
  'af-ZA': af,
  'ar-SA': ar,
  'ca-ES': ca,
  'cs-CZ': cs,
  'da-DK': da,
  'de-DE': de,
  'el-GR': el,
  'en-US': en,
  'es-ES': es,
  'fi-FI': fi,
  'fr-FR': fr,
  'he-IL': he,
  'hu-HU': hu,
  'id-ID': id,
  'it-IT': it,
  'ja-JP': ja,
  'ko-KR': ko,
  'nl-NL': nl,
  'no-NO': no,
  'pl-PL': pl,
  'pt-BR': pt,
  'pt-PT': pt,
  'ro-RO': ro,
  'ru-RU': ru,
  'sr-SP': sr,
  'sv-SE': sv,
  'sw-TZ': sw,
  'tr-TR': tr,
  'uk-UA': uk,
  'vi-VN': vi,
  'zh-CN': zh,
  'zh-TW': zh,
  'pseudo': en,
}

export async function dynamicActivate(locale: SupportedLocale) {
  i18n.loadLocaleData(locale, { plurals: plurals[locale] })
  try {
    const catalog = await import(`locales/${locale}.js`)
    // Bundlers will either export it as default or as a named export named default.
    i18n.load(locale, catalog.messages || catalog.default.messages)
  }
  catch (error) {
    console.error(error)
  }
  i18n.activate(locale)
}

interface LanguageProviderProps {
  locale: SupportedLocale
  forceRenderAfterLocaleChange?: boolean
  onActivate?: (locale: SupportedLocale) => void
  children: ReactNode
}

export function LanguageProvider({ locale, onActivate, children, forceRenderAfterLocaleChange }: LanguageProviderProps) {
  useEffect(() => {
    dynamicActivate(locale)
      .then(() => onActivate?.(locale))
      .catch((error) => {
        console.error('Failed to activate locale', locale, error)
      })
  }, [locale, onActivate])

  if (i18n.locale === undefined && locale === DEFAULT_LOCALE) {
    i18n.load(DEFAULT_LOCALE, {})
    i18n.activate(DEFAULT_LOCALE)
  }

  return (
    <I18nProvider forceRenderOnLocaleChange={forceRenderAfterLocaleChange} i18n={i18n}>
      {children}
    </I18nProvider>
  )
}
