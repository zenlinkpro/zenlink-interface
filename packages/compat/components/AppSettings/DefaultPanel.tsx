import type { Dispatch, FC, MouseEvent, SetStateAction } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { t, Trans } from '@lingui/macro'
import { LOCALE_LABEL, useSettings } from '@zenlink-interface/shared'
import { Typography } from '@zenlink-interface/ui'
import { useTheme } from 'next-themes'
import { useCallback, useMemo } from 'react'
import { SettingView } from './AppSettings'

interface DefaultProps {
  setView: Dispatch<SetStateAction<SettingView>>
}

export const DefaultPanel: FC<DefaultProps> = ({ setView }) => {
  const [{ userLocale }] = useSettings()
  const { theme, setTheme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const isAppearanceTransition = typeof document !== 'undefined'
    // @ts-expect-error Transition api
    && document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const toggleTheme = useCallback((event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (!isAppearanceTransition) {
      setTheme(isLightTheme ? 'dark' : 'light')
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )

    const transition = document.startViewTransition(() => {
      setTheme(isLightTheme ? 'dark' : 'light')
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        { clipPath },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }, [isAppearanceTransition, isLightTheme, setTheme])

  return (
    <div className="p-2 max-h-[300px] scroll">
      <div
        className="hover:bg-gray-200 hover:dark:bg-slate-700 px-3 h-[40px] flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all"
        onClick={toggleTheme}
      >
        <Typography className="text-gray-700 dark:text-slate-300" variant="sm" weight={500}>
          {isLightTheme ? t`Dark theme` : t`Light theme`}
        </Typography>
        {isLightTheme
          ? <MoonIcon height={22} width={22} />
          : <SunIcon height={22} width={22} />}
      </div>
      <div
        className="hover:bg-gray-200 hover:dark:bg-slate-700 px-3 h-[40px] flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all"
        onClick={() => { setView(SettingView.Locales) }}
      >
        <Typography className="text-gray-700 dark:text-slate-300" variant="sm" weight={500}>
          <Trans>Language</Trans>
        </Typography>
        <Typography className="text-gray-700 dark:text-slate-300" variant="sm" weight={500}>
          {LOCALE_LABEL[userLocale]}
        </Typography>
      </div>
    </div>
  )
}
