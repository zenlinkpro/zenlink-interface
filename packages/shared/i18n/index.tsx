import { i18n } from '@lingui/core'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { I18nProvider } from '@lingui/react'

import { useSettings } from '../state'
import type { SupportedLocale } from './constants'

export * from './constants'

export async function dynamicActivate(locale: SupportedLocale) {
  try {
    const catalog = await import(`@zenlink-interface/locales/${locale}.js`)
    // Bundlers will either export it as default or as a named export named default.
    i18n.load(locale, catalog.messages || catalog.default.messages)
  }
  catch (error) {
    console.error(error)
  }
  i18n.activate(locale)
}

interface LanguageProviderProps {
  onActivate?: (locale: SupportedLocale) => void
  children: ReactNode
}

export function LanguageProvider({ onActivate, children }: LanguageProviderProps) {
  const [{ userLocale }] = useSettings()

  useEffect(() => {
    dynamicActivate(userLocale)
      .then(() => {
        onActivate?.(userLocale)
      })
      .catch((error) => {
        console.error('Failed to activate locale', userLocale, error)
      })
  }, [userLocale, onActivate])

  // if (i18n.locale === undefined && userLocale === DEFAULT_LOCALE)
  //   i18n.activate(DEFAULT_LOCALE)

  return (
    <I18nProvider i18n={i18n}>
      {children}
    </I18nProvider>
  )
}
