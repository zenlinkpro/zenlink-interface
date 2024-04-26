import { Transition } from '@headlessui/react'
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { useDebounce } from '@zenlink-interface/hooks'
import { DEFAULT_INPUT_UNSTYLED, IconButton, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import { t } from '@lingui/macro'
import { useMarketFilters } from '../../../MarketsFiltersProvider'

export const TableFiltersSearchMarket: FC = () => {
  const { setFilters } = useMarketFilters()

  const [_query, setQuery] = useState<string>('')
  const [_extraQuery, setExtraQuery] = useState<string>('')
  const [extra] = useState(false)

  const debouncedQuery = useDebounce(_query, 400)
  const debouncedExtraQuery = useDebounce(_extraQuery, 400)

  useEffect(() => {
    setFilters({ query: debouncedQuery })
  }, [debouncedQuery, setFilters])

  useEffect(() => {
    setFilters({ extraQuery: debouncedExtraQuery })
  }, [debouncedExtraQuery, setFilters])

  useEffect(() => {
    if (!extra) {
      setTimeout(() => {
        setExtraQuery('')
      }, 750)
    }
  }, [extra, setFilters])

  return (
    <div
      className={classNames(
        'flex flex-grow sm:flex-grow-0 transform-all items-center gap-3 bg-slate-200 dark:bg-slate-800 rounded-xl h-[44px] border border-slate-300 dark:border-slate-700',
      )}
    >
      <div className={classNames('w-full sm:w-[240px] flex-grow flex gap-2 items-center px-2 py-2.5 rounded-2xl')}>
        <div className="min-w-[24px] w-6 h-6 min-h-[24px] flex flex-grow items-center justify-center">
          <MagnifyingGlassIcon className="text-slate-600 dark:text-slate-400" height={24} strokeWidth={2} width={24} />
        </div>
        <input
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'flex flex-grow !text-base placeholder:text-sm')}
          onInput={e => setQuery(e.currentTarget.value)}
          placeholder={t`Filter markets`}
          type="text"
          value={_query}
        />
        <Transition
          appear
          className="flex items-center"
          enter="transition duration-300 origin-center ease-out"
          enterFrom="transform scale-90 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
          show={_query?.length > 0}
        >
          <IconButton onClick={() => setQuery('')}>
            <XCircleIcon className="cursor-pointer text-slate-500 hover:text-slate-300" height={20} width={20} />
          </IconButton>
        </Transition>
      </div>
    </div>
  )
}
