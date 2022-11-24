import { Disclosure, RadioGroup, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { Token } from '@zenlink-interface/currency'
import type { StableSwap } from '@zenlink-interface/graph-client'
import { Currency, Typography, Widget, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { memo } from 'react'

interface SelectStablePoolWidgetProps {
  stablePools: StableSwap[] | undefined
  selectedStablePool: StableSwap | undefined
  setStablePool(type: StableSwap): void
}

export const SelectStablePoolWidget: FC<SelectStablePoolWidgetProps> = memo(
  ({ selectedStablePool, setStablePool, stablePools }) => (
    <Widget id="selectStablePool" maxWidth={400} className="!bg-slate-800">
      <Widget.Content>
        <Disclosure>
          {() => (
            <>
              <Disclosure.Button className="w-full pr-3">
                <div className="flex items-center justify-between">
                  <Widget.Header title="3. Select Pool" className="!pb-3" />
                  <Typography variant="sm" weight={700} className="px-2 py-1 rounded-lg bg-slate-900">
                    {selectedStablePool?.name ?? stablePools?.[0]?.name ?? 'None'}
                  </Typography>
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
                  <RadioGroup value={selectedStablePool} onChange={setStablePool}>
                    <div className="flex flex-col p-2 gap-2">
                      {stablePools?.map(pool => (
                        <RadioGroup.Option
                          key={pool.address}
                          value={pool}
                          className={({ checked }) => classNames(
                            checked ? 'bg-slate-600 bg-opacity-75' : 'bg-slate-900',
                            'relative flex cursor-pointer hover:bg-slate-600 rounded-lg px-5 py-4 shadow-md focus:outline-none',
                          )}
                        >
                          {({ checked }) => (
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm">
                                  <RadioGroup.Label className="flex items-center gap-2">
                                    <Currency.Icon
                                      currency={
                                        new Token({
                                          chainId: pool.chainId,
                                          name: pool.name,
                                          symbol: '4pool',
                                          decimals: 18,
                                          address: pool.lpToken,
                                        })
                                      }
                                      width={24}
                                      height={24}
                                    />
                                    <Typography variant="base" weight={500} className="text-slate-200">
                                      {pool.name}
                                    </Typography>
                                  </RadioGroup.Label>
                                  <RadioGroup.Description>
                                    <Typography variant="xxs" as="span" weight={400} className="text-slate-400">
                                      {pool.tokens.map(token => token.symbol).join(' / ')}
                                    </Typography>
                                  </RadioGroup.Description>
                                </div>
                              </div>
                              {checked && (
                                <div className="shrink-0 text-white">
                                  <CheckIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </Widget.Content>
    </Widget>
  ),
)
