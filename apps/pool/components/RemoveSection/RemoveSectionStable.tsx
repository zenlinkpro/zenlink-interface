import { Disclosure, Transition } from '@headlessui/react'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { Approve, Checker, useAccount, useRemoveLiquidityStableReview, useStableSwapWithBase } from '@zenlink-interface/compat'
import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { formatUSD } from '@zenlink-interface/format'
import type { StableSwap } from '@zenlink-interface/graph-client'
import { useNotifications, usePrices, useSettings } from '@zenlink-interface/shared'
import { Percent, ZERO } from '@zenlink-interface/math'
import {
  AppearOnMount,
  Button,
  DEFAULT_INPUT_UNSTYLED,
  Dots,
  Input,
  Typography,
  Currency as UICurrency,
  Widget,
  classNames,
} from '@zenlink-interface/ui'
import type { FC } from 'react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { usePoolPosition } from 'components'
import { useRemoveStableSwapLiquidity, useTokensFromStableSwap } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { Trans, t } from '@lingui/macro'

interface RemoveSectionStableProps {
  pool: StableSwap
}

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export const RemoveSectionStable: FC<RemoveSectionStableProps> = ({ pool }) => {
  const { address } = useAccount()
  const [{ slippageTolerance }] = useSettings()
  const [, { createNotification }] = useNotifications(address)
  const { data: prices } = usePrices({ chainId: pool.chainId })

  const slippagePercent = useMemo(
    () =>
      slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE,
    [slippageTolerance],
  )

  const [percentage, setPercentage] = useState<string>('')
  const [useBase] = useState(false)
  const [hover, setHover] = useState(false)
  const [tokenIndex, setTokenIndex] = useState(-1)
  const percentToRemove = useMemo(() => new Percent(percentage, 100), [percentage])

  const tokenMap = useTokens(pool.chainId)
  const { data } = useStableSwapWithBase(pool.chainId, tokenMap, pool.address)
  const { balance, values } = usePoolPosition()
  const tokens = useTokensFromStableSwap(data, useBase)

  const amountToRemove = useMemo(
    () => balance?.multiply(percentToRemove),
    [balance, percentToRemove],
  )
  const liquidity = useRemoveStableSwapLiquidity(data, amountToRemove as Amount<Token>, tokenIndex, useBase)
  const reviewedAmounts = useMemo(() => {
    if (!amountToRemove || amountToRemove.equalTo(ZERO)) {
      if (tokenIndex === -1) {
        return tokens.map(token => Amount.fromRawAmount(token, ZERO))
      }
      else {
        return data?.baseSwap && useBase
          ? [Amount.fromRawAmount(data.baseSwap.getToken(tokenIndex), ZERO)]
          : data
            ? [Amount.fromRawAmount(data.getToken(tokenIndex), ZERO)]
            : []
      }
    }

    const { amount, baseAmounts, metaAmounts } = liquidity
    const noneZeroAmounts = [amount, ...metaAmounts, ...baseAmounts]
      .filter(amount => amount?.greaterThan(ZERO)) as Amount<Token>[]

    if (!noneZeroAmounts.length)
      return tokens.map(token => Amount.fromRawAmount(token, ZERO))

    return noneZeroAmounts
  }, [amountToRemove, data, liquidity, tokenIndex, tokens, useBase])
  const minReviewedAmounts = useMemo(
    () => reviewedAmounts.map(amount => Amount.fromRawAmount(
      amount.currency,
      calculateSlippageAmount(amount, slippagePercent)[0],
    )),
    [reviewedAmounts, slippagePercent],
  )

  const onSelectToken = useCallback(
    (token?: Token) => {
      if (!token) {
        setTokenIndex(-1)

        return
      }
      if (data) {
        const metaIndex = data.getTokenIndex(token)

        if (metaIndex !== -1) {
          setTokenIndex(metaIndex)

          return
        }
      }

      if (data?.baseSwap && useBase) {
        const baseIndex = data.baseSwap.getTokenIndex(token)

        if (baseIndex !== -1) {
          setTokenIndex(baseIndex)

          return
        }
      }

      setTokenIndex(-1)
    },
    [data, useBase],
  )

  const selectValue = useMemo(
    () => tokenIndex === -1
      ? 'All'
      : data?.baseSwap && useBase
        ? data.baseSwap.getToken(tokenIndex).symbol
        : data?.getToken(tokenIndex).symbol,
    [data, tokenIndex, useBase],
  )

  const { sendTransaction, isWritePending, routerAddress } = useRemoveLiquidityStableReview({
    chainId: pool.chainId,
    swap: data,
    poolName: pool.name,
    minReviewedAmounts,
    liquidity,
    balance,
    amountToRemove,
    useBase,
  })

  return (
    <div className="relative overflow-auto" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
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
        <div className="border border-slate-500/20 dark:border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <Typography variant="xs" weight={600} className="bg-black/[0.12] dark:bg-white/[0.12] rounded-full p-2 px-3">
            <Trans>No liquidity tokens found</Trans>
          </Typography>
        </div>
      </Transition>
      <Widget id="removeLiquidity" maxWidth={440} className="bg-slate-200 dark:bg-slate-800">
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {() => (
              <>
                <Widget.Header title={t`Remove Liquidity`} className="!pb-3" />
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
                            <Trans>Balance: {balance?.toSignificant(6)}</Trans>
                          </Typography>
                        </AppearOnMount>
                      </div>
                      <Transition
                        show={Boolean(+percentage > 0 && amountToRemove)}
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
                          <div className="flex flex-wrap gap-2 px-0.5 pb-2">
                            <div
                              className={classNames(
                                selectValue === 'All' ? 'border-blue-300 dark:border-blue-700' : 'bg-slate-400 dark:bg-slate-600 border-transparent',
                                'hover:ring-1 flex items-center ring-blue-300 dark:ring-blue-700  border-2 rounded-xl overflow-hidden cursor-pointer p-2',
                              )}
                              onClick={() => onSelectToken(undefined)}
                            >
                              <Typography variant="sm" className="w-5 h-5 flex justify-center" weight={500}>
                                <Trans>All</Trans>
                              </Typography>
                            </div>
                            {tokens.map(token => (
                              <div
                                className={classNames(
                                  selectValue === token.symbol ? 'border-blue-300 dark:border-blue-700' : 'bg-slate-400 dark:bg-slate-600 border-transparent',
                                  'hover:ring-1 flex items-center ring-blue-300 dark:ring-blue-700  border-2 rounded-xl overflow-hidden cursor-pointer p-2',
                                )}
                                onClick={() => onSelectToken(token)}
                                key={token.address}
                              >
                                <UICurrency.Icon disableLink currency={token} width={20} height={20} />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <Typography variant="sm" weight={400} className="pb-1 text-slate-600 dark:text-slate-400">
                              <Trans>You&apos;ll receive at least:</Trans>
                            </Typography>
                          </div>
                          {minReviewedAmounts.map(amount => (
                            <div className="flex items-center justify-between" key={amount.currency.address}>
                              <Typography variant="sm" weight={500} className="flex items-center gap-2 text-slate-900 dark:text-slate-50">
                                {amount.currency && <UICurrency.Icon currency={amount.currency} width={20} height={20} />}
                                <span className="text-slate-600 dark:text-slate-400">
                                  <span className="text-slate-900 dark:text-slate-50">{amount.toSignificant(6)}</span>{' '}
                                  {amount.currency.symbol}
                                </span>
                              </Typography>
                              <Typography variant="xs" className="text-slate-600 dark:text-slate-400">
                                {prices ? formatUSD(Number(amount.toExact()) * Number(prices[amount.currency.address]?.toFixed(6))) : '$0.00'}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </Transition>

                      <Checker.Connected chainId={pool.chainId} fullWidth size="md">
                        <Checker.Custom
                          showGuardIfTrue={false}
                          guard={
                            <Button size="md" fullWidth disabled={true}>
                              <Trans>Pool Not Found</Trans>
                            </Button>
                          }
                        >
                          <Checker.Network fullWidth size="md" chainId={pool.chainId}>
                            <Checker.Custom
                              showGuardIfTrue={+percentage <= 0}
                              guard={
                                <Button size="md" fullWidth disabled={true}>
                                  <Trans>Enter Amount</Trans>
                                </Button>
                              }
                            >
                              <Approve
                                chainId={pool.chainId}
                                onSuccess={createNotification}
                                className="flex-grow !justify-end"
                                components={
                                  <Approve.Components>
                                    <Approve.Token
                                      chainId={pool.chainId}
                                      size="md"
                                      className="whitespace-nowrap"
                                      fullWidth
                                      amount={amountToRemove}
                                      address={routerAddress}
                                    />
                                  </Approve.Components>
                                }
                                render={({ approved }) => {
                                  return (
                                    <Button
                                      onClick={() => sendTransaction?.()}
                                      fullWidth
                                      size="md"
                                      variant="filled"
                                      disabled={!approved || isWritePending}
                                    >
                                      {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : t`Remove Liquidity`}
                                    </Button>
                                  )
                                }}
                              />
                            </Checker.Custom>
                          </Checker.Network>
                        </Checker.Custom>
                      </Checker.Connected>
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
