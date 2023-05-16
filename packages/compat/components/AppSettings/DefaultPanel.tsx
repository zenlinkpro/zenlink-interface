import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { LOCALE_LABEL, useSettings } from '@zenlink-interface/shared'
import { Typography } from '@zenlink-interface/ui'
import { useTheme } from 'next-themes'
import type { Dispatch, FC, MouseEvent, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { Trans, t } from '@lingui/macro'
import { SettingView } from './AppSettings'

interface DefaultProps {
  setView: Dispatch<SetStateAction<SettingView>>
}

export const DefaultPanel: FC<DefaultProps> = ({ setView }) => {
  const [{ userLocale }] = useSettings()
  const { theme, setTheme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  // @ts-expect-error: Transition API
  const isAppearanceTransition = document.startViewTransition
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

    // @ts-expect-error: Transition API
    const transition = document.startViewTransition(() => {
      setTheme(isLightTheme ? 'dark' : 'light')
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isLightTheme ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: isLightTheme ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
    })
  }, [isAppearanceTransition, isLightTheme, setTheme])

  return (
    <div className="p-2 max-h-[300px] scroll">
      <div
        onClick={toggleTheme}
        className="hover:bg-gray-200 hover:dark:bg-slate-700 px-3 h-[40px] flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all"
      >
        <Typography variant="sm" weight={500} className="text-gray-700 dark:text-slate-300">
          {isLightTheme ? t`Dark theme` : t`Light theme`}
        </Typography>
        {isLightTheme
          ? <MoonIcon width={22} height={22} />
          : <SunIcon width={22} height={22} />
        }
      </div>
      <div
        onClick={() => { setView(SettingView.Locales) }}
        className="hover:bg-gray-200 hover:dark:bg-slate-700 px-3 h-[40px] flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all"
      >
        <Typography variant="sm" weight={500} className="text-gray-700 dark:text-slate-300">
          <Trans>Language</Trans>
        </Typography>
        <Typography variant="sm" weight={500} className="text-gray-700 dark:text-slate-300">
          {LOCALE_LABEL[userLocale]}
        </Typography>
      </div>
    </div>
  )
}
