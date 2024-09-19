import type { ReactNode } from 'react'
import type { SupportedLocale } from './constants'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'

import { useEffect, useState } from 'react'
import { useSettings } from '../state'

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
  const [loadLocale, setLoadLocale] = useState(false)

  useEffect(() => {
    dynamicActivate(userLocale)
      .then(() => {
        onActivate?.(userLocale)
        setLoadLocale(true)
      })
      .catch((error) => {
        console.error('Failed to activate locale', userLocale, error)
      })
  }, [userLocale, onActivate])

  // Initialize the locale immediately if it is DEFAULT_LOCALE, so that keys are shown while the translation messages load.
  // This renders the translation _keys_, not the translation _messages_, which is only acceptable while loading the DEFAULT_LOCALE,
  // as [there are no "default" messages](https://github.com/lingui/js-lingui/issues/388#issuecomment-497779030).
  // See https://github.com/lingui/js-lingui/issues/1194#issuecomment-1068488619.
  // if (i18n.locale === undefined && userLocale === DEFAULT_LOCALE) {
  //   i18n.load(DEFAULT_LOCALE, {})
  //   i18n.activate(DEFAULT_LOCALE)
  // }

  if (!loadLocale)
    return null

  return (
    <I18nProvider i18n={i18n}>
      {children}
    </I18nProvider>
  )
}
