import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import type { ParachainId } from '@zenlink-interface/chain'
import { useAccount } from '@zenlink-interface/compat'
import type { Amount, Type } from '@zenlink-interface/currency'
import { Native } from '@zenlink-interface/currency'
import { formatUSD } from '@zenlink-interface/format'
import { useIsMounted } from '@zenlink-interface/hooks'
import { ZERO } from '@zenlink-interface/math'
import {
  AppearOnMount,
  Button,
  DEFAULT_INPUT_UNSTYLED,
  Input,
  Typography,
  Currency as UICurrency,
  classNames,
} from '@zenlink-interface/ui'
import { Widget } from '@zenlink-interface/ui/widget'
import type { FC, ReactNode } from 'react'
import { Fragment, useState } from 'react'

import { Trans, t } from '@lingui/macro'
import { usePoolPosition } from '../PoolPositionProvider'
import { SettingsOverlay } from '../SettingsOverlay'

interface RemoveSectionWidgetStandardProps {
  isFarm: boolean
  chainId: ParachainId
  percentage: string
  token0: Type
  token1: Type
  token0Minimum?: Amount<Type>
  token1Minimum?: Amount<Type>
  setPercentage(percentage: string): void
  children: ReactNode
}

export const RemoveSectionWidgetStandard: FC<RemoveSectionWidgetStandardProps> = ({
  isFarm,
  chainId,
  percentage,
  setPercentage,
  token0,
  token1,
  token0Minimum,
  token1Minimum,
  children,
}) => {
  const isMounted = useIsMounted()
  const [hover, setHover] = useState(false)
  const { address } = useAccount()
  const { balance, values } = usePoolPosition()

  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Transition
        show={Boolean(hover && !balance?.greaterThan(ZERO) && address)}
        as={Fragment}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <div className="border border-slate-500/20 dark:border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-white/[0.24] dark:bg-black/[0.24] rounded-2xl">
          <Typography variant="xs" weight={600} className="bg-black/[0.12] dark:bg-white/[0.12] rounded-full p-2 px-3">
            <Trans>
              No liquidity tokens found
              {isFarm && ', did you unstake?'}
            </Trans>
          </Typography>
        </div>
      </Transition>
      <Widget id="removeLiquidity" maxWidth={440} className="bg-slate-200 dark:bg-slate-800">
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {({ open }) => (
              <>
                {isFarm && isMounted
                  ? (
                    <Widget.Header title={t`Remove Liquidity`} className="!pb-3 ">
                      <div className="flex gap-3">
                        <SettingsOverlay chainId={chainId} variant="dialog" />
                        <Disclosure.Button className="w-full pr-0.5">
                          <div className="flex items-center justify-between">
                            <div
                              className={classNames(
                                open ? 'rotate-180' : 'rotate-0',
                                'transition-all w-5 h-5 -mr-1.5 flex items-center delay-300',
                              )}
                            >
                              <ChevronDownIcon
                                width={24}
                                height={24}
                                className="group-hover:text-slate-800 dark:group-hover:text-slate-200 text-slate-700 dark:text-slate-300"
                              />
                            </div>
                          </div>
                        </Disclosure.Button>
                      </div>
                    </Widget.Header>
                    )
                  : (
                    <Widget.Header title={t`Remove Liquidity`} className="!pb-3" />
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
                    <div className="flex flex-col gap-3 p-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-between flex-grow">
                          <Input.Percent
                            onUserInput={val => setPercentage(val ? Math.min(+val, 100).toString() : '')}
                            value={percentage}
                            placeholder="100%"
                            variant="unstyled"
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="xs" onClick={() => setPercentage('25')}>
                            25%
                          </Button>
                          <Button size="xs" onClick={() => setPercentage('50')}>
                            50%
                          </Button>
                          <Button size="xs" onClick={() => setPercentage('75')}>
                            75%
                          </Button>
                          <Button size="xs" onClick={() => setPercentage('100')}>
                            MAX
                          </Button>
                        </div>
                      </div>
                      <div className="grid items-center justify-between grid-cols-3 pb-2">
                        <AppearOnMount show={Boolean(balance)}>
                          <Typography variant="sm" weight={500} className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200">
                            {formatUSD(values.reduce((total, current) => total + current, 0) * (+percentage / 100))}
                          </Typography>
                        </AppearOnMount>
                        <AppearOnMount
                          className="flex justify-end col-span-2"
                          show={Boolean(balance)}
                        >
                          <Typography
                            onClick={() => setPercentage('100')}
                            as="button"
                            variant="sm"
                            weight={500}
                            className="truncate text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200"
                          >
                            <Trans>
                              Balance:
                              {balance?.toSignificant(6)}
                            </Trans>
                          </Typography>
                        </AppearOnMount>
                      </div>
                      <Transition
                        show={Boolean(+percentage > 0 && token0Minimum && token1Minimum)}
                        unmount={false}
                        className="transition-[max-height] overflow-hidden"
                        enter="duration-300 ease-in-out"
                        enterFrom="transform max-h-0"
                        enterTo="transform max-h-[380px]"
                        leave="transition-[max-height] duration-250 ease-in-out"
                        leaveFrom="transform max-h-[380px]"
                        leaveTo="transform max-h-0"
                      >
                        <div className="flex flex-col gap-3 py-3 pt-5 border-t border-slate-500/20 dark:border-slate-200/5">
                          <Typography variant="sm" weight={400} className="pb-1 text-slate-600 dark:text-slate-400">
                            <Trans>You&apos;ll receive at least:</Trans>
                          </Typography>

                          <div className="flex items-center justify-between">
                            <Typography variant="sm" weight={500} className="flex items-center gap-2 text-slate-50">
                              {token0 && <UICurrency.Icon currency={token0} width={20} height={20} />}
                              <span className="text-slate-600 dark:text-slate-400">
                                <span className="text-slate-900 dark:text-slate-50">{token0Minimum?.toSignificant(6)}</span>{' '}
                                {Native.onChain(chainId).wrapped.address === token0.wrapped.address
                                  ? Native.onChain(chainId).symbol
                                  : token0Minimum?.currency.symbol}
                              </span>
                            </Typography>
                            <Typography variant="xs" className="text-slate-600 dark:text-slate-400">
                              {formatUSD(values[0] * (+percentage / 100))}
                            </Typography>
                          </div>
                          <div className="flex items-center justify-between">
                            <Typography variant="sm" weight={500} className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
                              {token1 && <UICurrency.Icon currency={token1} width={20} height={20} />}
                              <span className="text-slate-600 dark:text-slate-400">
                                <span className="text-slate-900 dark:text-slate-50">{token1Minimum?.toSignificant(6)}</span>{' '}
                                {Native.onChain(chainId).wrapped.address === token1.wrapped.address
                                  ? Native.onChain(chainId).symbol
                                  : token1Minimum?.currency.symbol}
                              </span>
                            </Typography>
                            <Typography variant="xs" className="text-slate-600 dark:text-slate-400">
                              {formatUSD(values[1] * (+percentage / 100))}
                            </Typography>
                          </div>
                        </div>
                      </Transition>
                      {children}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    </div>
  )
}
