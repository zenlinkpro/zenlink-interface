import { Disclosure, Transition } from '@headlessui/react'
import { AdjustmentsVerticalIcon, ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { useSettings } from '@zenlink-interface/shared'
import { DEFAULT_INPUT_UNSTYLED, Input, Tab, Tooltip, Typography, classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'

export const SlippageToleranceDisclosure: FC = () => {
  const [{ slippageTolerance, slippageToleranceType }, { updateSlippageTolerance, updateSlippageToleranceType }]
    = useSettings()

  return (
    <Disclosure>
      {({ open }) => (
        <div className="border-b border-slate-500/20 dark:border-slate-200/5">
          <Disclosure.Button
            as="div"
            className="cursor-pointer relative flex items-center justify-between w-full gap-3 group rounded-xl"
          >
            <div className="flex items-center justify-center w-5 h-5">
              <AdjustmentsVerticalIcon width={20} height={20} className="-ml-0.5 text-slate-500" />
            </div>
            <div className="flex items-center justify-between w-full gap-1 py-4">
              <div className="flex items-center gap-1">
                <Typography variant="sm" weight={500}>
                  <Trans>Slippage Tolerance</Trans>
                </Typography>
                <Tooltip
                  content={
                    <div className="w-80 flex flex-col gap-2">
                      <Typography variant="xs" weight={500} className="text-slate-700 dark:text-slate-300">
                        <Trans>
                          Slippage tolerance is the utmost percentage of slippage a user is willing to execute a trade
                          with; if the actual slippage falls outside of the user-designated range, the transaction will
                          revert.
                        </Trans>
                      </Typography>
                      <Typography variant="xs" weight={500} className="text-slate-700 dark:text-slate-300">
                        <Trans>
                          Slippage is the difference between the expected value of output from a trade and the actual
                          value due to asset volatility and liquidity depth.
                        </Trans>
                      </Typography>
                    </div>
                  }
                >
                  <InformationCircleIcon width={14} height={14} />
                </Tooltip>
              </div>
              <div className="flex gap-1">
                <Typography variant="sm" weight={500} className="group-hover:text-slate-800 dark:group-hover:text-slate-200 text-slate-600 dark:text-slate-400">
                  {slippageToleranceType === 'auto' ? 'Auto' : `Custom (${slippageTolerance}%)`}
                </Typography>
                <div
                  className={classNames(
                    open ? 'rotate-90' : 'rotate-0',
                    'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300',
                  )}
                >
                  <ChevronRightIcon width={16} height={16} className="group-hover:text-slate-800 dark:group-hover:text-slate-200 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
            </div>
          </Disclosure.Button>

          <Transition
            unmount={false}
            className="transition-[max-height] overflow-hidden mb-3"
            enter="duration-300 ease-in-out"
            enterFrom="transform max-h-0"
            enterTo="transform max-h-[380px]"
            leave="transition-[max-height] duration-250 ease-in-out"
            leaveFrom="transform max-h-[380px]"
            leaveTo="transform max-h-0"
          >
            <Disclosure.Panel>
              <Tab.Group
                selectedIndex={slippageToleranceType === 'auto' ? 0 : 1}
                onChange={index => updateSlippageToleranceType(index === 0 ? 'auto' : 'custom')}
              >
                <Tab.List>
                  <Tab><Trans>Auto</Trans></Tab>
                  <Tab><Trans>Custom</Trans></Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel />
                  <Tab.Panel>
                    <div className="mt-2 flex flex-col gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl">
                      <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <Trans>Custom Slippage</Trans>
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Input.Numeric
                          type="number"
                          variant="unstyled"
                          value={slippageTolerance ?? ''}
                          onUserInput={val => updateSlippageTolerance(+val)}
                          placeholder="1"
                          className={classNames(DEFAULT_INPUT_UNSTYLED, '')}
                          max={100}
                        />
                        <Typography variant="xs" weight={500} className="text-slate-500">
                          %
                        </Typography>
                      </div>
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
