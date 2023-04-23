import { Popover } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'

import { Dialog, Input, classNames } from '@zenlink-interface/ui'
import { CHAIN_META as chains } from '../config/chain'
import { NetworkIcon } from '../icons/NetworkIcon'
import type { NetworkSelectorProps } from './index'

export const NetworkSelectorDialog = <T extends string>({
  networks,
  onSelect,
  selected,
  children,
}: Omit<NetworkSelectorProps<T>, 'variant'>) => {
  const [query, setQuery] = useState<string>('')

  return (
    <Popover>
      {({ open, close }) => (
        <>
          {typeof children === 'function' ? children({ open, close }) : children}
          <Dialog open={open} onClose={() => close()}>
            <Dialog.Content className="flex flex-col gap-2 scroll sm:overflow-hidden !pb-0 !h-[75vh] sm:!h-[640px]">
              <Popover.Panel className="overflow-hidden">
                <Input.Search value={query} loading={false} onChange={setQuery} />
                <div className="h-[calc(100%-44px)] scroll overflow-auto py-3">
                  {networks
                    .filter(el => (query ? chains[el].name.toLowerCase().includes(query.toLowerCase()) : Boolean))
                    .map(el => (
                      <button
                        onClick={() => onSelect(el, close)}
                        key={el}
                        className={classNames(
                          'w-full group hover:bg-white hover:dark:bg-slate-800 px-2.5 flex rounded-lg justify-between gap-2 items-center cursor-pointer transform-all h-[40px]',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <NetworkIcon
                            type="naked"
                            chain={chains[el].chain}
                            width={24}
                            height={24}
                            className="text-gray-600 group-hover:text-gray-900 dark:text-slate-50"
                          />
                          <p
                            className={classNames(
                              selected === el ? 'font-semibold text-gray-900' : 'font-medium text-gray-500',
                              'text-sm group-hover:text-gray-900 dark:text-slate-300 group-hover:dark:text-slate-50',
                            )}
                          >
                            {chains[el].name}
                          </p>
                        </div>
                        {selected === el && <CheckIcon width={20} height={20} strokeWidth={2} className="text-blue" />}
                      </button>
                    ))}
                </div>
              </Popover.Panel>
            </Dialog.Content>
          </Dialog>
        </>
      )}
    </Popover>
  )
}
