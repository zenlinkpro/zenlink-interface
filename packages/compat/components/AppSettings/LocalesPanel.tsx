import type { Dispatch, FC, SetStateAction } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { LOCALE_LABEL, SUPPORTED_LOCALES, useSettings } from '@zenlink-interface/shared'
import { IconButton, Typography } from '@zenlink-interface/ui'
import { SettingView } from './AppSettings'

interface LocalesProps {
  setView: Dispatch<SetStateAction<SettingView>>
}

export const LocalesPanel: FC<LocalesProps> = ({ setView }) => {
  const [{ userLocale }, { updateUserLocale }] = useSettings()

  return (
    <div>
      <div className="grid grid-cols-3 items-center h-12 border-b border-slate-500/20 dark:border-slate-200/20 px-2">
        <div className="flex items-center">
          <IconButton onClick={() => setView(SettingView.Default)}>
            <ChevronLeftIcon className="text-slate-400" height={24} width={24} />
          </IconButton>
        </div>
        <Typography className="text-slate-500" weight={600}>
          Languages
        </Typography>
      </div>
      <div className="flex flex-col p-2 max-h-[300px] scroll">
        {SUPPORTED_LOCALES.map(locale => (
          <div
            className="flex px-2 py-2 justify-between items-center hover:bg-gray-200 hover:dark:bg-slate-700 cursor-pointer rounded-lg"
            key={locale}
            onClick={() => updateUserLocale(locale)}
          >
            <Typography className="text-gray-700 dark:text-slate-300" variant="sm" weight={500}>
              {LOCALE_LABEL[locale]}
            </Typography>
            {locale === userLocale && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
          </div>
        ))}
      </div>
    </div>
  )
}
