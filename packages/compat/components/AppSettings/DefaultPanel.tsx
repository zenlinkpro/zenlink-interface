import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { LOCALE_LABEL, useSettings } from '@zenlink-interface/shared'
import { Typography } from '@zenlink-interface/ui'
import { useTheme } from 'next-themes'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useMemo } from 'react'
import { SettingView } from './AppSettings'

interface DefaultProps {
  setView: Dispatch<SetStateAction<SettingView>>
}

export const DefaultPanel: FC<DefaultProps> = ({ setView }) => {
  const [{ userLocale }] = useSettings()
  const { theme, setTheme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  return (
    <div className="p-2 max-h-[300px] scroll">
      <div
        onClick={() => { setTheme(isLightTheme ? 'dark' : 'light') }}
        className="hover:bg-gray-200 hover:dark:bg-slate-700 px-3 h-[40px] flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all"
      >
        <Typography variant="sm" weight={500} className="text-gray-700 dark:text-slate-300">
          {isLightTheme ? 'Dark theme' : 'Light theme'}
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
          Language
        </Typography>
        <Typography variant="sm" weight={500} className="text-gray-700 dark:text-slate-300">
          {LOCALE_LABEL[userLocale]}
        </Typography>
      </div>
    </div>
  )
}
