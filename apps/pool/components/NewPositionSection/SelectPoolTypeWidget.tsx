import { Disclosure, Transition } from '@headlessui/react'
import type { ParachainId } from '@zenlink-interface/chain'
import { PoolFinderType } from '@zenlink-interface/compat'
import { Tab, Tooltip, Typography } from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'
import type { FC } from 'react'
import React, { memo } from 'react'
import { STABLE_SWAP_ENABLED_NETWORKS } from 'config'
import { Trans } from '@lingui/macro'

interface SelectPoolTypeWidgetProps {
  selectedNetwork: ParachainId
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
}

export const SelectPoolTypeWidget: FC<SelectPoolTypeWidgetProps> = memo(
  function SelectPoolTypeWidget({ poolType, setPoolType, selectedNetwork }) {
    return (
      <Widget id="selectPoolType" maxWidth={440} className="dark:!bg-slate-800 !border-slate-500/20">
        <Widget.Content>
          <Disclosure>
            {() => (
              <>
                {!STABLE_SWAP_ENABLED_NETWORKS.includes(selectedNetwork)
                  ? (
                    <Tooltip
                      content={(
                        <Typography variant="xs" className="max-w-[220px]">
                          <Trans>This network does not allow changing the default pool type</Trans>
                        </Typography>
                      )}
                    >
                      <div className="flex items-center justify-between pr-3">
                        <Widget.Header title={<Trans>2. Select Type</Trans>} className="!pb-3" />
                        <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900">
                          <Trans>Standard</Trans>
                        </Typography>
                      </div>
                    </Tooltip>
                    )
                  : (
                    <Disclosure.Button className="w-full pr-3">
                      <div className="flex items-center justify-between">
                        <Widget.Header title="2. Select Type" className="!pb-3" />
                        <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900">
                          {PoolFinderType[poolType]}
                        </Typography>
                      </div>
                    </Disclosure.Button>
                    )}
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
                    <div className="p-3 pt-0">
                      <Tab.Group selectedIndex={poolType} onChange={setPoolType}>
                        <Tab.List className="grid grid-cols-2 mt-2">
                          <Disclosure.Button>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5">
                                <Typography variant="xs" weight={500} className="text-slate-800 dark:text-slate-200">
                                  <Trans>Standard</Trans>
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-600 dark:text-slate-400">
                                  <Trans>Suitable for regular pairs</Trans>
                                </Typography>
                              </div>
                            </Tab>
                          </Disclosure.Button>
                          <Disclosure.Button>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5 ">
                                <Typography variant="xs" weight={500} className="text-slate-800 dark:text-slate-200">
                                  <Trans>Stable</Trans>
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-600 dark:text-slate-400">
                                  <Trans>Suitable for stable pools</Trans>
                                </Typography>
                              </div>
                            </Tab>
                          </Disclosure.Button>
                        </Tab.List>
                      </Tab.Group>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    )
  },
)
