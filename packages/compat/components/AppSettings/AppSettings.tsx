import type { FC } from 'react'
import { useMemo } from 'react'
import { Popover } from '@headlessui/react'
import { DEFAULT_INPUT_UNSTYLED, Typography, classNames } from '@zenlink-interface/ui'
import { Cog6ToothIcon, MoonIcon, SunIcon } from '@heroicons/react/20/solid'
import { useTheme } from 'next-themes'

export const AppSettings: FC = () => {
  const { theme, setTheme } = useTheme()
  const isLightTheme = useMemo(() => theme === 'light', [theme])

  const panel = (
    <Popover.Panel className="flex flex-col w-full sm:w-[320px] fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] mt-4 sm:rounded-xl rounded-b-none shadow-sm shadow-black/[0.3] bg-white dark:bg-slate-800 border border-slate-500/20 dark:border-slate-200/20">
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
      </div>
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
