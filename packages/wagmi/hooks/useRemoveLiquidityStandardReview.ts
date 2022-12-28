import type { Pair } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { Native } from '@zenlink-interface/currency'
import type { Percent } from '@zenlink-interface/math'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import type { SendTransactionResult } from '@wagmi/core'
import { useAccount, useNetwork } from 'wagmi'
import type { TransactionRequest } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import { calculateGasMargin } from '../calculateGasMargin'
import { useStandardRouterContract } from './useStandardRouter'
import { useTransactionDeadline } from './useTransactionDeadline'
import { useSendTransaction } from './useSendTransaction'

interface UseRemoveLiquidityStandardReviewParams {
  chainId: ParachainId
  token0: Type
  token1: Type
  minAmount0: Amount<Type> | undefined
  minAmount1: Amount<Type> | undefined
  pool: Pair | null
  percentToRemove: Percent
  balance: Amount<Type> | undefined
}

type UseRemoveLiquidityStandardReview = (params: UseRemoveLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveLiquidityStandardReview: UseRemoveLiquidityStandardReview = ({
  chainId,
  token0,
  token1,
  percentToRemove,
  minAmount0,
  minAmount1,
  balance,
  pool,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const { address } = useAccount()
  const deadline = useTransactionDeadline(ethereumChainId)
  const { chain } = useNetwork()

  const contract = useStandardRouterContract(pool?.chainId)
  const [, { createNotification }] = useNotifications(address)

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !pool?.chainId)
        return
      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId: pool.chainId,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          completed: `Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          failed: 'Something went wrong when removing liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [createNotification, pool?.chainId, token0.symbol, token1.symbol],
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      try {
        if (
          !token0
          || !token1
          || !chain?.id
          || !contract
          || !address
          || !pool
          || !balance
          || !minAmount0
          || !minAmount1
          || !deadline
        )
          return

        const withNative
          = Native.onChain(pool.chainId).wrapped.address === pool.token0.address
          || Native.onChain(pool.chainId).wrapped.address === pool.token1.address

        let methodNames
        let args: any

        if (withNative) {
          const token1IsNative = Native.onChain(pool.chainId).wrapped.address === pool.token1.wrapped.address
          methodNames = ['removeLiquidityNativeCurrency']
          args = [
            token1IsNative ? pool.token0.wrapped.address : pool.token1.wrapped.address,
            balance.multiply(percentToRemove).quotient.toString(),
            token1IsNative ? minAmount0.quotient.toString() : minAmount1.quotient.toString(),
            token1IsNative ? minAmount1.quotient.toString() : minAmount0.quotient.toString(),
            address,
            deadline.toHexString(),
          ]
        }
        else {
          methodNames = ['removeLiquidity']
          args = [
            pool.token0.wrapped.address,
            pool.token1.wrapped.address,
            balance.multiply(percentToRemove).quotient.toString(),
            minAmount0.quotient.toString(),
            minAmount1.quotient.toString(),
            address,
            deadline.toHexString(),
          ]
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
        //
      }
    },
    [token0, token1, chain?.id, contract, address, pool, balance, minAmount0, minAmount1, percentToRemove, deadline],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId: pool?.chainId,
    prepare,
    onSettled,
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: sendTransaction as (() => void) | undefined,
    routerAddress: contract?.address,
  }), [contract?.address, isWritePending, sendTransaction])
}
