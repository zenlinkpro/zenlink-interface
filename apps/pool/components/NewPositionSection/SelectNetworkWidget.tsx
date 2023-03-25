import { Disclosure, Transition } from '@headlessui/react'
import type { ParachainId } from '@zenlink-interface/chain'
import chains from '@zenlink-interface/chain'
import { Network, NetworkIcon, Typography, classNames } from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'
import type { FC } from 'react'
import React, { memo } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'

interface SelectNetworkWidgetProps {
  selectedNetwork: ParachainId
  onSelect(chainId: ParachainId): void
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(({ selectedNetwork, onSelect }) => {
  return (
    <Widget id="selectNetwork" maxWidth={440} className="dark:!bg-slate-800 !border-slate-500/20">
      <Widget.Content>
        <Disclosure>
          {() => (
            <>
              <Disclosure.Button className="w-full pr-3">
                <div className="flex items-center justify-between">
                  <Widget.Header title="1. Select Network" className="!pb-3" />
                  <div className={classNames('w-6 h-6')}>
                    <NetworkIcon chainId={selectedNetwork} width={24} height={24} />
                  </div>
                </div>
              </Disclosure.Button>
              <Transition
                unmount={false}
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
              >
                <Disclosure.Panel unmount={false}>
                  <div className="p-3 space-y-3">
                    <Typography variant="xs" className="text-slate-700 dark:text-slate-300">
                      Selected:{' '}
                      <Typography variant="xs" weight={600} as="span" className="text-slate-900 dark:text-slate-100">
                        {chains[selectedNetwork].name}
                      </Typography>
                    </Typography>
                    <Network.Selector
                      className="!ring-offset-slate-300 dark:!ring-offset-slate-700"
                      networks={SUPPORTED_CHAIN_IDS}
                      selectedNetworks={[selectedNetwork]}
                      exclusive={true}
                      onChange={networks => onSelect(networks[0])}
                      renderer={element => <Disclosure.Button>{element}</Disclosure.Button>}
                    />
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </Widget.Content>
    </Widget>
  )
})
