import { Transition } from '@headlessui/react'
import { MagnifyingGlassIcon, PlusIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { useDebounce } from '@zenlink-interface/hooks'
import { DEFAULT_INPUT_UNSTYLED, IconButton, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import { usePoolFilters } from '../../PoolsFiltersProvider'

export const TableFiltersSearchToken: FC = () => {
  const { setFilters } = usePoolFilters()

  const [_query, setQuery] = useState<string>('')
  const [_extraQuery, setExtraQuery] = useState<string>('')
  const [extra, setExtra] = useState(false)

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
        'flex flex-grow sm:flex-grow-0 transform-all items-center gap-3 pr-3 bg-slate-300 dark:bg-slate-800 rounded-2xl h-12',
      )}
    >
      <div
        className={classNames(
          _query ? 'pr-8' : 'pr-4',
          'w-full sm:w-[240px] flex-grow pr-4 transform-all relative flex gap-2 items-center px-4 py-2.5 rounded-2xl',
        )}
      >
        <div className="min-w-[24px] w-6 h-6 min-h-[24px] flex flex-grow items-center justify-center">
          <MagnifyingGlassIcon className="text-slate-500" height={20} strokeWidth={2} width={20} />
        </div>
        <input
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'flex flex-grow !text-base placeholder:text-sm')}
          onInput={e => setQuery(e.currentTarget.value)}
          placeholder="Search a token"
          type="text"
          value={_query}
        />
        <Transition
          appear
          as="div"
          className="absolute top-0 bottom-0 right-0 flex items-center"
          enter="transition duration-300 origin-center ease-out"
          enterFrom="transform scale-90 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
          show={_query?.length > 0}
        >
          <IconButton onClick={() => setQuery('')}>
            <XCircleIcon className="cursor-pointer text-slate-500 hover:text-slate-700 dark:hover:text-slate-300" height={20} width={20} />
          </IconButton>
        </Transition>
      </div>
      <Transition
        as="div"
        className="transition-[max-width] overflow-hidden flex items-center h-12 gap-2"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-w-0"
        enterTo="transform max-w-[200px]"
        leave="transition-[max-width] duration-250 ease-in-out"
        leaveFrom="transform max-w-[200px]"
        leaveTo="transform max-w-0"
        show
      >
        <div className="h-full py-3 px-2">
          <div className="w-px h-full bg-slate-500/20 dark:bg-slate-200/20" />
        </div>
        <Transition
          as="div"
          className="flex flex-grow transition-[max-width] overflow-hidden"
          enter="duration-300 ease-in-out"
          enterFrom="transform max-w-0"
          enterTo="transform max-w-[200px]"
          leave="transition-[max-width] duration-250 ease-in-out"
          leaveFrom="transform max-w-[200px]"
          leaveTo="transform max-w-0"
          show={extra}
          unmount={false}
        >
          <input
            className={classNames(DEFAULT_INPUT_UNSTYLED, 'w-[200px] !text-base placeholder:text-sm')}
            onInput={e => setExtraQuery(e.currentTarget.value)}
            placeholder="... other token"
            type="text"
            value={_extraQuery}
          />
        </Transition>
        <IconButton className="mr-1" onClick={() => setExtra(prev => !prev)}>
          <PlusIcon
            className={classNames(
              extra ? 'rotate-45' : '',
              'transition-[transform] ease-in-out rotate-0 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 delay-[400ms]',
            )}
            height={20}
            width={20}
          />
        </IconButton>
      </Transition>
    </div>
  )
}
