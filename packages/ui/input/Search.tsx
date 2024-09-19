import type { FC, ReactElement } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { Loader } from '../index'

import { DEFAULT_INPUT_NO_RINGS } from './index'

export interface SearchProps {
  className?: string
  input?: (props: any) => ReactElement | null
  value: string
  loading: boolean
  onChange: (val: string) => void
}

export const Search: FC<SearchProps> = ({ className, loading, input: Input, value, onChange }) => {
  return (
    <div
      className={classNames(
        className,
        '!focus-within:bg-gray-200 relative pr-10 rounded-xl flex gap-2.5 flex-grow items-center bg-gray-200 dark:bg-slate-800 px-3 py-2.5 h-[44px]',
      )}
    >
      <MagnifyingGlassIcon className="text-gray-500 dark:text-slate-500" height={24} strokeWidth={2} width={24} />
      {Input
        ? (
            <Input
              className={classNames(
                'font-medium w-full bg-transparent !p-0 placeholder:font-medium placeholder:text-gray-400 placeholder:dark:text-slate-500 text-gray-900 dark:text-slate-200',
                DEFAULT_INPUT_NO_RINGS,
              )}
              onChange={onChange}
              placeholder="Search"
              value={value}
              variant="unstyled"
            />
          )
        : (
            <input
              className={classNames(
                'truncate font-semibold w-full bg-transparent !p-0 placeholder:font-medium placeholder:text-gray-400 placeholder:dark:text-slate-500 text-gray-900 dark:text-slate-200',
                DEFAULT_INPUT_NO_RINGS,
              )}
              onChange={e => onChange(e.target.value)}
              placeholder="Search"
              value={value}
            />
          )}
      {(loading || value) && (
        <div className="absolute right-3 flex items-center">
          {loading
            ? (
                <div>
                  <Loader className="text-gray-700 dark:text-slate-500" size={16} />
                </div>
              )
            : value
              ? (
                  <div onClick={() => onChange('')}>
                    <XMarkIcon className="cursor-pointer text-slate-500 hover:text-slate-300" height={24} width={24} />
                  </div>
                )
              : <></>}
        </div>
      )}
    </div>
  )
}
