import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionRequest } from '@ethersproject/providers'
import { Disclosure, Transition } from '@headlessui/react'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import { Amount } from '@zenlink-interface/currency'
import { formatUSD } from '@zenlink-interface/format'
import type { StableSwap } from '@zenlink-interface/graph-client'
import { Percent, ZERO } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
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
import {
  Approve,
  Checker,
  calculateGasMargin,
  getStableRouterContractConfig,
  usePrices,
  useSendTransaction,
  useStableRouterContract,
  useStableSwapWithBase,
} from '@zenlink-interface/wagmi'
import { usePoolPosition } from 'components'
import { useRemoveStableSwapLiquidity, useTokensFromStableSwap, useTransactionDeadline } from 'lib/hooks'
import { useTokens } from 'lib/state/token-lists'
import type { Dispatch, FC, SetStateAction } from 'react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import type { SendTransactionResult } from 'wagmi/actions'

interface RemoveSectionStableProps {
  pool: StableSwap
}

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export const RemoveSectionStable: FC<RemoveSectionStableProps> = ({ pool }) => {
  const ethereumChainId = chainsParachainIdToChainId[pool.chainId ?? -1]
  const { chain } = useNetwork()
  const { address } = useAccount()
  const deadline = useTransactionDeadline(ethereumChainId)
  const contract = useStableRouterContract(pool.chainId)
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

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !pool.chainId)
        return
      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId: pool.chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Removing liquidity from the ${pool.name} stable pool`,
          completed: `Successfully removed liquidity from the ${pool.name} stable pool`,
          failed: 'Something went wrong when removing liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [createNotification, pool.chainId, pool.name],
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        const { amount, baseAmounts, metaAmounts } = liquidity
        if (
          !address
          || !chain?.id
          || !contract
          || !data
          || !balance
          || !deadline
          || !pool
          || !minReviewedAmounts.some(amount => amount.greaterThan(ZERO))
        ) return

        const isOneToken = !!amount
        const isBasePool = !!data.baseSwap && useBase

        let methodNames
        let args: any

        if (isOneToken) {
          if (isBasePool) {
            methodNames = ['removePoolAndBaseLiquidityOneToken']
            args = [
              data.contractAddress,
              data.baseSwap?.contractAddress,
              amountToRemove?.quotient.toString(),
              data.baseSwap?.getTokenIndex(amount.currency),
              calculateSlippageAmount(amount, slippagePercent)[0].toString(),
              address,
              deadline.toHexString(),
            ]
          }
          else {
            methodNames = ['removePoolLiquidityOneToken']
            args = [
              data.contractAddress,
              amountToRemove?.quotient.toString(),
              data.getTokenIndex(amount.currency),
              calculateSlippageAmount(amount, slippagePercent)[0].toString(),
              address,
              deadline.toHexString(),
            ]
          }
        }
        else {
          if (isBasePool) {
            methodNames = ['removePoolAndBaseLiquidity']
            args = [
              data.contractAddress,
              data.baseSwap?.contractAddress,
              amountToRemove?.quotient.toString(),
              metaAmounts.map(amount => calculateSlippageAmount(amount, slippagePercent)[0]?.toString()),
              baseAmounts.map(amount => calculateSlippageAmount(amount, slippagePercent)[0]?.toString()),
              address,
              deadline.toHexString(),
            ]
          }
          else {
            methodNames = ['removePoolLiquidity']
            args = [
              data.contractAddress,
              amountToRemove?.quotient.toString(),
              metaAmounts.map(amount => calculateSlippageAmount(amount, slippagePercent)[0]?.toString()),
              address,
              deadline.toHexString(),
            ]
          }
        }

        const safeGasEstimates = await Promise.all(
          methodNames.map(methodName =>
            contract.estimateGas[methodName](...args)
              .then(calculateGasMargin)
              .catch(),
          ),
        )

        const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(safeGasEstimate =>
          BigNumber.isBigNumber(safeGasEstimate),
        )

        if (indexOfSuccessfulEstimation !== -1) {
          const methodName = methodNames[indexOfSuccessfulEstimation]
          const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData(methodName, args),
            gasLimit: safeGasEstimate,
          })
        }
      }
      catch (e: unknown) {
      }
    },
    [address, amountToRemove?.quotient, balance, chain?.id, contract, data, deadline, liquidity, minReviewedAmounts, pool, slippagePercent, useBase],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId: pool.chainId,
    prepare,
    onSettled,
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
        <div className="border border-slate-200/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <Typography variant="xs" weight={600} className="bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No liquidity tokens found
          </Typography>
        </div>
      </Transition>
      <Widget id="removeLiquidity" maxWidth={400} className="bg-slate-800">
        <Widget.Content>
          <Disclosure defaultOpen={true}>
            {() => (
              <>
                <Widget.Header title="Remove Liquidity" className="!pb-3" />
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
                          <Typography variant="sm" weight={500} className="text-slate-300 hover:text-slate-20">
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
                            className="truncate text-slate-300 hover:text-slate-200"
                          >
                            Balance: {balance?.toSignificant(6)}
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
                        <div className="flex flex-col gap-3 py-3 pt-5 border-t border-slate-200/5">
                          <div className="flex flex-wrap gap-2 px-0.5 pb-2">
                            <div
                              className={classNames(
                                selectValue === 'All' ? 'border-blue-700' : 'bg-slate-600 border-transparent',
                                'hover:ring-1 flex items-center ring-blue-700  border-2 rounded-xl overflow-hidden cursor-pointer p-2',
                              )}
                              onClick={() => onSelectToken(undefined)}
                            >
                              <Typography variant="sm" className="w-5 h-5 flex justify-center" weight={500}>All</Typography>
                            </div>
                            {tokens.map(token => (
                              <div
                                className={classNames(
                                  selectValue === token.symbol ? 'border-blue-700' : 'bg-slate-600 border-transparent',
                                  'hover:ring-1 flex items-center ring-blue-700  border-2 rounded-xl overflow-hidden cursor-pointer p-2',
                                )}
                                onClick={() => onSelectToken(token)}
                                key={token.address}
                              >
                                <UICurrency.Icon disableLink currency={token} width={20} height={20} />
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <Typography variant="sm" weight={400} className="pb-1 text-slate-400">
                              You&apos;ll receive at least:
                            </Typography>
                          </div>
                          {minReviewedAmounts.map(amount => (
                            <div className="flex items-center justify-between" key={amount.currency.address}>
                              <Typography variant="sm" weight={500} className="flex items-center gap-2 text-slate-50">
                                {amount.currency && <UICurrency.Icon currency={amount.currency} width={20} height={20} />}
                                <span className="text-slate-400">
                                  <span className="text-slate-50">{amount.toSignificant(6)}</span>{' '}
                                  {amount.currency.symbol}
                                </span>
                              </Typography>
                              <Typography variant="xs" className="text-slate-400">
                                {prices ? formatUSD(Number(amount.toExact()) * Number(prices[amount.currency.address]?.toFixed(6))) : '$0.00'}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </Transition>

                      <Checker.Connected fullWidth size="md">
                        <Checker.Custom
                          showGuardIfTrue={false}
                          guard={
                            <Button size="md" fullWidth disabled={true}>
                              Pool Not Found
                            </Button>
                          }
                        >
                          <Checker.Network fullWidth size="md" chainId={pool.chainId}>
                            <Checker.Custom
                              showGuardIfTrue={+percentage <= 0}
                              guard={
                                <Button size="md" fullWidth disabled={true}>
                                  Enter Amount
                                </Button>
                              }
                            >
                              <Approve
                                onSuccess={createNotification}
                                className="flex-grow !justify-end"
                                components={
                                  <Approve.Components>
                                    <Approve.Token
                                      size="md"
                                      className="whitespace-nowrap"
                                      fullWidth
                                      amount={amountToRemove}
                                      address={getStableRouterContractConfig(pool.chainId).address}
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
                                      {isWritePending ? <Dots>Confirm transaction</Dots> : 'Remove Liquidity'}
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
