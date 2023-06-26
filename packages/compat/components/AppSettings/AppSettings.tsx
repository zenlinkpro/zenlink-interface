import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Popover } from '@headlessui/react'
import { DEFAULT_INPUT_UNSTYLED, classNames } from '@zenlink-interface/ui'
import { Cog6ToothIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'
import { DefaultPanel } from './DefaultPanel'
import { LocalesPanel } from './LocalesPanel'

export enum SettingView {
  Default,
  Locales,
}

export const AppSettings: FC = () => {
  const [view, setView] = useState<SettingView>(SettingView.Default)
  const { setTheme } = useTheme()
  useEffect(() => {
    const listeners = {
      dark: (mediaQueryList: MediaQueryListEvent) => {
        if (mediaQueryList.matches)
          setTheme('dark')
      },
      light: (mediaQueryList: MediaQueryListEvent) => {
        if (mediaQueryList.matches)
          setTheme('light')
      },
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listeners.dark)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', listeners.light)
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listeners.dark)
      window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', listeners.light)
    }
  }, [setTheme])

  const panel = (
    <Popover.Panel className="flex flex-col w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-sm shadow-black/[0.3] bg-white dark:bg-slate-800 border border-slate-500/20 dark:border-slate-200/20">
      {view === SettingView.Default && <DefaultPanel setView={setView} />}
      {view === SettingView.Locales && <LocalesPanel setView={setView} />}
    </Popover.Panel>
  )

  return (
    <Popover className="relative">
      {() => {
        return (
          <>
            <Popover.Button
              className={classNames(
                DEFAULT_INPUT_UNSTYLED,
                'flex items-center justify-center !bg-black/[0.04] dark:!bg-white/[0.04] hover:!bg-black/[0.08] hover:dark:!bg-white/[0.08] hover:text-black hover:dark:text-white h-[38px] rounded-xl px-2 !font-semibold !text-sm text-slate-800 dark:text-slate-200',
              )}
            >
              <Cog6ToothIcon
                width={20}
                height={20}
                className="hover:animate-spin-slow transition-transform"
              />
            </Popover.Button>
            {panel}
          </>
        )
      }}
    </Popover>
  )
}
