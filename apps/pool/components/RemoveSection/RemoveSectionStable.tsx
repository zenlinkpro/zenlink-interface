import type { Token } from '@zenlink-interface/currency'
import type { StableSwap } from '@zenlink-interface/graph-client'
import type { FC } from 'react'
import { Disclosure, DisclosurePanel, Transition } from '@headlessui/react'
import { t, Trans } from '@lingui/macro'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { Approve, Checker, useAccount, useRemoveLiquidityStableReview, useStableSwapWithBase } from '@zenlink-interface/compat'
import { Amount } from '@zenlink-interface/currency'
import { formatUSD } from '@zenlink-interface/format'
import { Percent, ZERO } from '@zenlink-interface/math'
import { useNotifications, usePrices, useSettings } from '@zenlink-interface/shared'
import {
  AppearOnMount,
  Button,
  classNames,
  DEFAULT_INPUT_UNSTYLED,
  Dots,
  Input,
  Typography,
  Currency as UICurrency,
  Widget,
} from '@zenlink-interface/ui'
import { usePoolPosition } from 'components'
import { useRemoveStableSwapLiquidity, useTokensFromStableSwap } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import { Fragment, useCallback, useMemo, useState } from 'react'

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
        as={Fragment}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
        show={Boolean(hover && !balance?.greaterThan(ZERO) && address)}
      >
        <div className="border border-slate-500/20 dark:border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <Typography className="bg-black/[0.12] dark:bg-white/[0.12] rounded-full p-2 px-3" variant="xs" weight={600}>
            <Trans>No liquidity tokens found</Trans>
          </Typography>
        </div>
      </Transition>
      <Widget className="bg-slate-200 dark:bg-slate-800" id="removeLiquidity" maxWidth={440}>
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {() => (
              <>
                <Widget.Header className="!pb-3" title={t`Remove Liquidity`} />
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
                    <div className="flex flex-col gap-3 p-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-between flex-grow">
                          <Input.Percent
                            className={classNames(DEFAULT_INPUT_UNSTYLED, '!text-2xl')}
                            onUserInput={val => setPercentage(val ? Math.min(+val, 100).toString() : '')}
                            placeholder="100%"
                            value={percentage}
                            variant="unstyled"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setPercentage('25')} size="xs">
                            25%
                          </Button>
                          <Button onClick={() => setPercentage('50')} size="xs">
                            50%
                          </Button>
                          <Button onClick={() => setPercentage('75')} size="xs">
                            75%
                          </Button>
                          <Button onClick={() => setPercentage('100')} size="xs">
                            MAX
                          </Button>
                        </div>
                      </div>
                      <div className="grid items-center justify-between grid-cols-3 pb-2">
                        <AppearOnMount show={Boolean(balance)}>
                          <Typography className="text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200" variant="sm" weight={500}>
                            {formatUSD(values.reduce((total, current) => total + current, 0) * (+percentage / 100))}
                          </Typography>
                        </AppearOnMount>
                        <AppearOnMount
                          className="flex justify-end col-span-2"
                          show={Boolean(balance)}
                        >
                          <Typography
                            as="button"
                            className="truncate text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200"
                            onClick={() => setPercentage('100')}
                            variant="sm"
                            weight={500}
                          >
                            <Trans>
                              Balance: {balance?.toSignificant(6)}
                            </Trans>
                          </Typography>
                        </AppearOnMount>
                      </div>
                      <Transition
                        as="div"
                        className="transition-[max-height] overflow-hidden"
                        enter="duration-300 ease-in-out"
                        enterFrom="transform max-h-0"
                        enterTo="transform max-h-[380px]"
                        leave="transition-[max-height] duration-250 ease-in-out"
                        leaveFrom="transform max-h-[380px]"
                        leaveTo="transform max-h-0"
                        show={Boolean(+percentage > 0 && amountToRemove)}
                        unmount={false}
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
                              <Typography className="w-5 h-5 flex justify-center" variant="sm" weight={500}>
                                <Trans>All</Trans>
                              </Typography>
                            </div>
                            {tokens.map(token => (
                              <div
                                className={classNames(
                                  selectValue === token.symbol ? 'border-blue-300 dark:border-blue-700' : 'bg-slate-400 dark:bg-slate-600 border-transparent',
                                  'hover:ring-1 flex items-center ring-blue-300 dark:ring-blue-700  border-2 rounded-xl overflow-hidden cursor-pointer p-2',
                                )}
                                key={token.address}
                                onClick={() => onSelectToken(token)}
                              >
                                <UICurrency.Icon currency={token} disableLink height={20} width={20} />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <Typography className="pb-1 text-slate-600 dark:text-slate-400" variant="sm" weight={400}>
                              <Trans>You&apos;ll receive at least:</Trans>
                            </Typography>
                          </div>
                          {minReviewedAmounts.map(amount => (
                            <div className="flex items-center justify-between" key={amount.currency.address}>
                              <Typography className="flex items-center gap-2 text-slate-900 dark:text-slate-50" variant="sm" weight={500}>
                                {amount.currency && <UICurrency.Icon currency={amount.currency} height={20} width={20} />}
                                <span className="text-slate-600 dark:text-slate-400">
                                  <span className="text-slate-900 dark:text-slate-50">{amount.toSignificant(6)}</span>{' '}
                                  {amount.currency.symbol}
                                </span>
                              </Typography>
                              <Typography className="text-slate-600 dark:text-slate-400" variant="xs">
                                {prices ? formatUSD(Number(amount.toExact()) * Number(prices[amount.currency.address]?.toFixed(6))) : '$0.00'}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </Transition>
                      <Checker.Connected chainId={pool.chainId} fullWidth size="md">
                        <Checker.Custom
                          guard={(
                            <Button disabled={true} fullWidth size="md">
                              <Trans>Pool Not Found</Trans>
                            </Button>
                          )}
                          showGuardIfTrue={false}
                        >
                          <Checker.Network chainId={pool.chainId} fullWidth size="md">
                            <Checker.Custom
                              guard={(
                                <Button disabled={true} fullWidth size="md">
                                  <Trans>Enter Amount</Trans>
                                </Button>
                              )}
                              showGuardIfTrue={+percentage <= 0}
                            >
                              <Approve
                                chainId={pool.chainId}
                                className="flex-grow !justify-end"
                                components={(
                                  <Approve.Components>
                                    <Approve.Token
                                      address={routerAddress}
                                      amount={amountToRemove}
                                      chainId={pool.chainId}
                                      className="whitespace-nowrap"
                                      fullWidth
                                      size="md"
                                    />
                                  </Approve.Components>
                                )}
                                onSuccess={createNotification}
                                render={({ approved }) => {
                                  return (
                                    <Button
                                      disabled={!approved || isWritePending}
                                      fullWidth
                                      onClick={() => sendTransaction?.()}
                                      size="md"
                                      variant="filled"
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
                  </DisclosurePanel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Widget.Content>
      </Widget>
    </div>
  )
}
