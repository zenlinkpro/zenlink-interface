import type { SendTransactionResult } from '@wagmi/core'
import { waitForTransaction } from 'wagmi/actions'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
import { Percent, ZERO } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { BigNumber } from 'ethers'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { encodeFunctionData } from 'viem'
import { calculateGasMargin } from '../calculateGasMargin'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase, WagmiTransactionRequest } from '../types'
import { useSendTransaction } from './useSendTransaction'
import { getStableRouterContractConfig, useStableRouterContract } from './useStableRouter'
import { useTransactionDeadline } from './useTransactionDeadline'

interface UseRemoveLiquidityStableReviewParams {
  chainId: ParachainId
  swap: StableSwapWithBase | undefined
  poolName: string | undefined
  minReviewedAmounts: Amount<Token>[]
  liquidity: CalculatedStbaleSwapLiquidity
  balance: Amount<Type> | undefined
  amountToRemove: Amount<Type> | undefined
  useBase: boolean
}

type UseRemoveLiquidityStableReview = (params: UseRemoveLiquidityStableReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export const useRemoveLiquidityStableReview: UseRemoveLiquidityStableReview = ({
  chainId,
  swap,
  poolName,
  liquidity,
  minReviewedAmounts,
  amountToRemove,
  balance,
  useBase,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId]
  const { chain } = useNetwork()
  const { address } = useAccount()
  const deadline = useTransactionDeadline(ethereumChainId)
  const { address: contractAddress, abi } = getStableRouterContractConfig(chainId)
  const contract = useStableRouterContract(chainId)

  const [{ slippageTolerance }] = useSettings()
  const [, { createNotification }] = useNotifications(address)

  const slippagePercent = useMemo(
    () =>
      slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE,
    [slippageTolerance],
  )

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !chainId || !poolName)
        return
      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId,
        txHash: data.hash,
        promise: waitForTransaction({ hash: data.hash }),
        summary: {
          pending: t`Removing liquidity from the ${poolName} stable pool`,
          completed: t`Successfully removed liquidity from the ${poolName} stable pool`,
          failed: t`Something went wrong when removing liquidity`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, poolName],
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        const { amount, baseAmounts, metaAmounts } = liquidity
        if (
          !address
          || !chain?.id
          || !contract
          || !swap
          || !balance
          || !deadline
          || !minReviewedAmounts.some(amount => amount.greaterThan(ZERO))
        ) return

        const isOneToken = !!amount
        const isBasePool = !!swap.baseSwap && useBase

        if (isOneToken) {
          if (isBasePool) {
            const functionName = 'removePoolAndBaseLiquidityOneToken'
            const args: [`0x${string}`, `0x${string}`, bigint, number, bigint, `0x${string}`, bigint] = [
              swap.contractAddress as Address,
              swap.baseSwap?.contractAddress as Address,
              BigInt(amountToRemove?.quotient.toString() ?? '0'),
              swap.baseSwap?.getTokenIndex(amount.currency) as number,
              BigInt(calculateSlippageAmount(amount, slippagePercent)[0].toString()),
              address,
              deadline.toBigInt(),
            ]

            const estimateGas = await contract.estimateGas[functionName](args, { account: address })
              .then(value => calculateGasMargin(BigNumber.from(value)))
              .catch(() => undefined)

            if (estimateGas) {
              setRequest({
                account: address,
                to: contractAddress,
                data: encodeFunctionData({ abi, functionName, args }),
                gas: estimateGas.toBigInt(),
              })
            }
          }
          else {
            const functionName = 'removePoolLiquidityOneToken'
            const args: [`0x${string}`, bigint, number, bigint, `0x${string}`, bigint] = [
              swap.contractAddress as Address,
              BigInt(amountToRemove?.quotient.toString() ?? '0'),
              swap.getTokenIndex(amount.currency),
              BigInt(calculateSlippageAmount(amount, slippagePercent)[0].toString()),
              address,
              deadline.toBigInt(),
            ]

            const estimateGas = await contract.estimateGas[functionName](args, { account: address })
              .then(value => calculateGasMargin(BigNumber.from(value)))
              .catch(() => undefined)

            if (estimateGas) {
              setRequest({
                account: address,
                to: contractAddress,
                data: encodeFunctionData({ abi, functionName, args }),
                gas: estimateGas.toBigInt(),
              })
            }
          }
        }
        else {
          if (isBasePool) {
            const functionName = 'removePoolAndBaseLiquidity'
            const args: [`0x${string}`, `0x${string}`, bigint, bigint[], bigint[], `0x${string}`, bigint] = [
              swap.contractAddress as Address,
              swap.baseSwap?.contractAddress as Address,
              BigInt(amountToRemove?.quotient.toString() ?? '0'),
              metaAmounts.map(amount => BigInt(calculateSlippageAmount(amount, slippagePercent)[0]?.toString())),
              baseAmounts.map(amount => BigInt(calculateSlippageAmount(amount, slippagePercent)[0]?.toString())),
              address,
              deadline.toBigInt(),
            ]

            const estimateGas = await contract.estimateGas[functionName](args, { account: address })
              .then(value => calculateGasMargin(BigNumber.from(value)))
              .catch(() => undefined)

            if (estimateGas) {
              setRequest({
                account: address,
                to: contractAddress,
                data: encodeFunctionData({ abi, functionName, args }),
                gas: estimateGas.toBigInt(),
              })
            }
          }
          else {
            const functionName = 'removePoolLiquidity'
            const args: [`0x${string}`, bigint, bigint[], `0x${string}`, bigint] = [
              swap.contractAddress as Address,
              BigInt(amountToRemove?.quotient.toString() ?? 0),
              metaAmounts.map(amount => BigInt(calculateSlippageAmount(amount, slippagePercent)[0]?.toString())),
              address,
              deadline.toBigInt(),
            ]

            const estimateGas = await contract.estimateGas[functionName](args, { account: address })
              .then(value => calculateGasMargin(BigNumber.from(value)))
              .catch(() => undefined)

            if (estimateGas) {
              setRequest({
                account: address,
                to: contractAddress,
                data: encodeFunctionData({ abi, functionName, args }),
                gas: estimateGas.toBigInt(),
              })
            }
          }
        }
      }
      catch (e: unknown) {
      }
    },
    [abi, address, amountToRemove?.quotient, balance, chain?.id, contract, contractAddress, deadline, liquidity, minReviewedAmounts, slippagePercent, swap, useBase],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction,
    routerAddress: contractAddress,
  }), [contractAddress, isWritePending, sendTransaction])
}
