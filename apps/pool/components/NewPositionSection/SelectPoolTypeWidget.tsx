import type { ParachainId } from '@zenlink-interface/chain'
import type { FC } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { Trans } from '@lingui/macro'
import { PoolFinderType } from '@zenlink-interface/compat'
import { Tab, Tooltip, Typography } from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'
import { STABLE_SWAP_ENABLED_NETWORKS } from 'config'
import React, { memo } from 'react'

interface SelectPoolTypeWidgetProps {
  selectedNetwork: ParachainId
  poolType: PoolFinderType
  setPoolType: (type: PoolFinderType) => void
}

export const SelectPoolTypeWidget: FC<SelectPoolTypeWidgetProps> = memo(
  function SelectPoolTypeWidget({ poolType, setPoolType, selectedNetwork }) {
    return (
      <Widget className="dark:!bg-slate-800 !border-slate-500/20" id="selectPoolType" maxWidth={440}>
        <Widget.Content>
          <Disclosure>
            {() => (
              <>
                {!STABLE_SWAP_ENABLED_NETWORKS.includes(selectedNetwork)
                  ? (
                      <Tooltip
                        content={(
                          <Typography className="max-w-[220px]" variant="xs">
                            <Trans>This network does not allow changing the default pool type</Trans>
                          </Typography>
                        )}
                      >
                        <div className="flex items-center justify-between pr-3">
                          <Widget.Header className="!pb-3" title={<Trans>2. Select Type</Trans>} />
                          <Typography className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900" variant="sm" weight={700}>
                            <Trans>Standard</Trans>
                          </Typography>
                        </div>
                      </Tooltip>
                    )
                  : (
                      <Disclosure.Button className="w-full pr-3">
                        <div className="flex items-center justify-between">
                          <Widget.Header className="!pb-3" title="2. Select Type" />
                          <Typography className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900" variant="sm" weight={700}>
                            {PoolFinderType[poolType]}
                          </Typography>
                        </div>
                      </Disclosure.Button>
                    )}
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
                    <div className="p-3 pt-0">
                      <Tab.Group onChange={setPoolType} selectedIndex={poolType}>
                        <Tab.List className="grid grid-cols-2 mt-2">
                          <DisclosureButton>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5">
                                <Typography className="text-slate-800 dark:text-slate-200" variant="xs" weight={500}>
                                  <Trans>Standard</Trans>
                                </Typography>
                                <Typography className="text-slate-600 dark:text-slate-400" variant="xxs" weight={500}>
                                  <Trans>Suitable for regular pairs</Trans>
                                </Typography>
                              </div>
                            </Tab>
                          </DisclosureButton>
                          <DisclosureButton>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5 ">
                                <Typography className="text-slate-800 dark:text-slate-200" variant="xs" weight={500}>
                                  <Trans>Stable</Trans>
                                </Typography>
                                <Typography className="text-slate-600 dark:text-slate-400" variant="xxs" weight={500}>
                                  <Trans>Suitable for stable pools</Trans>
                                </Typography>
                              </div>
                            </Tab>
                          </DisclosureButton>
                        </Tab.List>
                      </Tab.Group>
                    </div>
                  </DisclosurePanel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    )
  },
)
