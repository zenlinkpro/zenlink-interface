import type { Pair } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import { Native } from '@zenlink-interface/currency'
import type { Percent } from '@zenlink-interface/math'
import { useNotifications } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { encodeFunctionData } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import { waitForTransactionReceipt } from 'wagmi/actions'
import type { WagmiTransactionRequest } from '../types'
import { config } from '../client'
import { getStandardRouterContractConfig, useStandardRouterContract } from './useStandardRouter'
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
  const ethereumChainId = chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1]
  const { address, chain } = useAccount()
  const deadline = useTransactionDeadline(ethereumChainId)

  const { address: contractAddress, abi } = getStandardRouterContractConfig(chainId)
  const contract = useStandardRouterContract(pool?.chainId)
  const [, { createNotification }] = useNotifications(address)

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash || !pool?.chainId)
        return
      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId: pool.chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Removing liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          completed: t`Successfully removed liquidity from the ${token0.symbol}/${token1.symbol} pair`,
          failed: t`Something went wrong when removing liquidity`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [createNotification, pool?.chainId, token0.symbol, token1.symbol],
  )

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
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

        if (withNative) {
          const token1IsNative = Native.onChain(pool.chainId).wrapped.address === pool.token1.wrapped.address
          const functionName = 'removeLiquidityNativeCurrency'
          const args: [`0x${string}`, bigint, bigint, bigint, `0x${string}`, bigint] = [
            (token1IsNative ? pool.token0.wrapped.address : pool.token1.wrapped.address) as Address,
            BigInt(balance.multiply(percentToRemove).quotient.toString()),
            BigInt(token1IsNative ? minAmount0.quotient.toString() : minAmount1.quotient.toString()),
            BigInt(token1IsNative ? minAmount1.quotient.toString() : minAmount0.quotient.toString()),
            address,
            deadline.toBigInt(),
          ]
          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName, args }),
            value: BigInt(0), // track issue https://github.com/wagmi-dev/wagmi/issues/2887
          })
        }
        else {
          const functionName = 'removeLiquidity'
          const args: [`0x${string}`, `0x${string}`, bigint, bigint, bigint, `0x${string}`, bigint] = [
            pool.token0.wrapped.address as Address,
            pool.token1.wrapped.address as Address,
            BigInt(balance.multiply(percentToRemove).quotient.toString()),
            BigInt(minAmount0.quotient.toString()),
            BigInt(minAmount1.quotient.toString()),
            address,
            deadline.toBigInt(),
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName, args }),
            value: BigInt(0), // track issue https://github.com/wagmi-dev/wagmi/issues/2887
          })
        }
      }
      catch (e: unknown) {
        //
      }
    },
    [token0, token1, chain?.id, contract, address, pool, balance, minAmount0, minAmount1, deadline, percentToRemove, contractAddress, abi],
  )

  const {
    request,
    estimateGas,
    useSendTransactionReturn: {
      sendTransaction,
      isPending: isWritePending,
    },
  } = useSendTransaction({
    chainId: pool?.chainId,
    prepare,
    mutation: {
      onSettled,
    },
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: request && estimateGas
      ? () => sendTransaction({ ...request })
      : undefined,
    routerAddress: contractAddress,
  }), [contractAddress, estimateGas, isWritePending, request, sendTransaction])
}
