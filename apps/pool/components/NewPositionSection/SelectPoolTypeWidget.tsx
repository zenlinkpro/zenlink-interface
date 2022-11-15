import { Disclosure, Transition } from '@headlessui/react'
import type { ParachainId } from '@zenlink-interface/chain'
import { Tab, Tooltip, Typography } from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'
import type { PoolFinderType } from '@zenlink-interface/wagmi'
import type { FC } from 'react'
import React, { memo } from 'react'

interface SelectPoolTypeWidgetProps {
  selectedNetwork: ParachainId
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
}

export const SelectPoolTypeWidget: FC<SelectPoolTypeWidgetProps> = memo(
  ({ poolType, setPoolType }) => {
    return (
      <Widget id="selectPoolType" maxWidth={400} className="!bg-slate-800">
        <Widget.Content>
          <Disclosure>
            {() => (
              <>
               <Tooltip
                  mouseEnterDelay={0.3}
                  button={
                    <div className="flex items-center justify-between pr-3">
                      <Widget.Header title="2. Select Type" className="!pb-3" />
                      <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-900">
                        Standard
                      </Typography>
                    </div>
                  }
                  panel={
                    <Typography variant="xs" className="max-w-[220px]">
                      This network does not allow changing the default pool type
                    </Typography>
                  }
                ></Tooltip>
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
                                <Typography variant="xs" weight={500} className="text-slate-200">
                                  Standard
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-400">
                                  Suitable for regular pairs
                                </Typography>
                              </div>
                            </Tab>
                          </Disclosure.Button>
                          <Disclosure.Button>
                            <Tab as="div" className="!h-[unset] p-2">
                              <div className="flex flex-col gap-0.5 ">
                                <Typography variant="xs" weight={500} className="text-slate-200">
                                  Stable
                                </Typography>
                                <Typography variant="xxs" weight={500} className="text-slate-400">
                                  Suitable for stable pairs
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
