import type { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import chains from '@zenlink-interface/chain'
import { classNames, Network, NetworkIcon, Typography } from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'

import React, { memo } from 'react'
import { SUPPORTED_CHAIN_IDS } from '../../config'

interface SelectNetworkWidgetProps {
  selectedNetwork: ParachainId
  onSelect: (chainId: ParachainId) => void
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(function SelectNetworkWidget({ selectedNetwork, onSelect }) {
  return (
    <Widget className="dark:!bg-slate-800 !border-slate-500/20" id="selectNetwork" maxWidth={440}>
      <Widget.Content>
        <Disclosure>
          {() => (
            <>
              <DisclosureButton className="w-full pr-3">
                <div className="flex items-center justify-between">
                  <Widget.Header className="!pb-3" title={<Trans>1. Select Network</Trans>} />
                  <div className={classNames('w-6 h-6')}>
                    <NetworkIcon chainId={selectedNetwork} height={24} width={24} />
                  </div>
                </div>
              </DisclosureButton>
              <Transition
                as="div"
                className="transition-[max-height] overflow-hidden"
                enter="duration-300 ease-in-out"
                enterFrom="transform max-h-0"
                enterTo="transform max-h-[380px]"
                leave="transition-[max-height] duration-250 ease-in-out"
                leaveFrom="transform max-h-[380px]"
                leaveTo="transform max-h-0"
                unmount={false}
              >
                <DisclosurePanel unmount={false}>
                  <div className="p-3 space-y-3">
                    <Typography className="text-slate-700 dark:text-slate-300" variant="xs">
                      <Trans>Selected:</Trans>{' '}
                      <Typography as="span" className="text-slate-900 dark:text-slate-100" variant="xs" weight={600}>
                        {chains[selectedNetwork].name}
                      </Typography>
                    </Typography>
                    <Network.Selector
                      className="!ring-offset-slate-300 dark:!ring-offset-slate-700"
                      exclusive={true}
                      networks={SUPPORTED_CHAIN_IDS}
                      onChange={networks => onSelect(networks[0])}
                      renderer={element => <Disclosure.Button>{element}</Disclosure.Button>}
                      selectedNetworks={[selectedNetwork]}
                    />
                  </div>
                </DisclosurePanel>
              </Transition>
            </>
          )}
        </Disclosure>
      </Widget.Content>
    </Widget>
  )
})
