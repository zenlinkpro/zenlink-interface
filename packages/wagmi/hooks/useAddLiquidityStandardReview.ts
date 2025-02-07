import type { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import type { Dispatch, SetStateAction } from 'react'
import type { Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../types'
import { t } from '@lingui/core/macro'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import { Amount } from '@zenlink-interface/currency'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { BigNumber } from 'ethers'
import { useCallback, useMemo } from 'react'
import { encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../client'
import { PairState } from './usePairs'
import { useSendTransaction } from './useSendTransaction'
import { getStandardRouterContractConfig, useStandardRouterContract } from './useStandardRouter'
import { useTransactionDeadline } from './useTransactionDeadline'

interface UseAddLiquidityStandardReviewParams {
  chainId: ParachainId
  poolState: PairState
  token0: Type | undefined
  token1: Type | undefined
  input0: Amount<Type> | undefined
  input1: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseAddLiquidityStandardReview = (params: UseAddLiquidityStandardReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddLiquidityStandardReview: UseAddLiquidityStandardReview = ({
  chainId,
  token0,
  token1,
  input0,
  input1,
  setOpen,
  poolState,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1]
  const { address, chain } = useAccount()
  const deadline = useTransactionDeadline(ethereumChainId)

  const [, { createNotification }] = useNotifications(address)
  const { address: contractAddress, abi } = getStandardRouterContractConfig(chainId)
  const contract = useStandardRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash || !token0 || !token1)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Adding liquidity to the ${token0.symbol || 'token0'}/${token1.symbol || 'token1'} pair`,
          completed: t`Successfully added liquidity to the ${token0.symbol || 'token0'}/${token1.symbol || 'token1'} pair`,
          failed: t`Something went wrong when adding liquidity`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, token0, token1],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      input0
        ? poolState === PairState.NOT_EXISTS
          ? input0
          : Amount.fromRawAmount(input0.currency, calculateSlippageAmount(input0, slippagePercent)[0])
        : undefined,
      input1
        ? poolState === PairState.NOT_EXISTS
          ? input1
          : Amount.fromRawAmount(input1.currency, calculateSlippageAmount(input1, slippagePercent)[0])
        : undefined,
    ]
  }, [poolState, input0, input1, slippagePercent])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (
          !token0
          || !token1
          || !chain?.id
          || !contract
          || !input0
          || !input1
          || !address
          || !minAmount0
          || !minAmount1
          || !deadline
        ) {
          return
        }
        const withNative = token0.isNative || token1.isNative

        if (withNative) {
          const value = BigInt((token1.isNative ? input1 : input0).quotient.toString())
          const args: [Address, bigint, bigint, bigint, Address, bigint] = [
            (token1.isNative ? token0 : token1).wrapped.address as Address,
            BigInt((token1.isNative ? input0 : input1).quotient.toString()),
            BigInt((token1.isNative ? minAmount0 : minAmount1).quotient.toString()),
            BigInt((token1.isNative ? minAmount1 : minAmount0).quotient.toString()),
            address,
            deadline.toBigInt(),
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addLiquidityNativeCurrency', args }),
            value: BigNumber.from(value).toBigInt(),
          })
        }
        else {
          const args: [Address, Address, bigint, bigint, bigint, bigint, Address, bigint] = [
            token0.wrapped.address as Address,
            token1.wrapped.address as Address,
            BigInt(input0.quotient.toString()),
            BigInt(input1.quotient.toString()),
            BigInt(minAmount0.quotient.toString()),
            BigInt(minAmount1.quotient.toString()),
            address,
            deadline.toBigInt(),
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addLiquidity', args }),
          })
        }
      }
      catch { }
    },
    [token0, token1, chain?.id, contract, input0, input1, address, minAmount0, minAmount1, deadline, contractAddress, abi],
  )

  const {
    estimateGas,
    request,
    useSendTransactionReturn: {
      sendTransaction,
      isPending: isWritePending,
    },
  } = useSendTransaction({
    mutation: {
      onSettled,
      onSuccess: () => setOpen(false),
    },
    chainId,
    prepare,
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: request && estimateGas
      ? () => sendTransaction({ ...request })
      : undefined,
    routerAddress: contractAddress,
  }), [contractAddress, estimateGas, isWritePending, request, sendTransaction])
}
