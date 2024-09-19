import type { NetworkSelectorProps } from './index'
import { Popover, Transition } from '@headlessui/react'
import { classNames, Input, NetworkIcon } from '@zenlink-interface/ui'
import React, { useState } from 'react'

import { CHAIN_META as chains } from '../config/chain'

export function NetworkSelectorMenu<T extends string>({
  selected,
  onSelect,
  networks = [],
  children,
  align = 'right',
}: Omit<NetworkSelectorProps<T>, 'variant'>) {
  const [query, setQuery] = useState('')

  return (
    <Popover>
      {({ open, close }) => (
        <>
          {typeof children === 'function' ? children({ close, open }) : children}
          <Transition
            as="div"
            enter="transition duration-300 ease-out"
            enterFrom="transform translate-y-[-16px] opacity-0"
            enterTo="transform translate-y-0 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform translate-y-0 opacity-100"
            leaveTo="transform translate-y-[-16px] opacity-0"
            show={open}
          >
            <div
              className={classNames(align === 'right' ? 'right-0' : 'left-0', 'absolute pt-2 -top-[-1] sm:w-[320px]')}
            >
              <div className="p-2 flex flex-col w-full fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-[unset] sm:left-[unset] rounded-2xl rounded-b-none sm:rounded-b-xl shadow-md bg-white dark:bg-slate-800">
                <Popover.Panel>
                  <Input.Search
                    className="!bg-gray-100 dark:!bg-slate-700"
                    loading={false}
                    onChange={setQuery}
                    value={query}
                  />
                  <div className="h-px w-full bg-gray-100 dark:bg-slate-200/5 mt-2" />
                  <div className="pt-2 max-h-[300px] scroll">
                    {networks
                      .filter(el => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                      .map(el => (
                        <button
                          className={classNames(
                            'w-full group hover:bg-gray-100 hover:dark:bg-slate-700 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]',
                          )}
                          key={el}
                          onClick={() => onSelect(el, close)}
                        >
                          <div className="flex items-center gap-2.5">
                            <NetworkIcon
                              chainId={chains[el].chainId}
                              className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50"
                              height={24}
                              type="naked"
                              width={24}
                            />
                            <p
                              className={classNames(
                                selected === el ? 'font-semibold text-gray-900' : 'font-medium text-gray-500',
                                'text-sm group-hover:text-gray-900 dark:text-slate-300 dark:group-hover:text-slate-50',
                              )}
                            >
                              {chains[el].name}
                            </p>
                          </div>
                          {selected === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
                        </button>
                      ))}
                  </div>
                </Popover.Panel>
              </div>
            </div>
          </Transition>
        </>
      )}
    </Popover>
  )
}
