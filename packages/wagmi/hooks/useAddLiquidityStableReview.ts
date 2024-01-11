import { waitForTransactionReceipt } from 'wagmi/actions'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Amount, Token } from '@zenlink-interface/currency'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { t } from '@lingui/macro'
import type { Address } from 'viem'
import { encodeFunctionData } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase, WagmiTransactionRequest } from '../types'
import { config } from '../client'
import { useSendTransaction } from './useSendTransaction'
import { getStableRouterContractConfig, useStableRouterContract } from './useStableRouter'
import { useTransactionDeadline } from './useTransactionDeadline'

interface UseAddLiquidityStableReviewParams {
  chainId: ParachainId
  swap: StableSwapWithBase | undefined
  poolName: string | undefined
  inputs: Amount<Token>[]
  useBase: boolean
  liquidity: CalculatedStbaleSwapLiquidity
  setOpen: Dispatch<SetStateAction<boolean>>
}

type UseAddLiquidityStableReview = (params: UseAddLiquidityStableReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddLiquidityStableReview: UseAddLiquidityStableReview = ({
  chainId,
  swap,
  poolName,
  inputs,
  useBase,
  liquidity,
  setOpen,
}) => {
  const ethereumChainId = chainsParachainIdToChainId[chainId ?? -1]
  const deadline = useTransactionDeadline(ethereumChainId)
  const { address, chain } = useAccount()

  const [, { createNotification }] = useNotifications(address)
  const contract = useStableRouterContract(chainId)
  const { address: contractAddress, abi } = getStableRouterContractConfig(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash || !swap || !poolName)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Adding liquidity to the ${poolName} stable pool`,
          completed: t`Successfully added liquidity to the ${poolName} stable pool`,
          failed: t`Something went wrong when adding liquidity`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, poolName, swap],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        const { amount, baseAmounts, metaAmounts } = liquidity
        if (
          !swap
          || !amount
          || !inputs.length
          || !chain?.id
          || !address
          || !deadline
          || !contract
        )
          return

        if (swap.baseSwap && useBase) {
          const args: [Address, Address, bigint[], bigint[], bigint, Address, bigint] = [
            swap.contractAddress as Address,
            swap.baseSwap.contractAddress as Address,
            metaAmounts.map(amount => BigInt(amount.quotient.toString())),
            baseAmounts.map(amount => BigInt(amount.quotient.toString())),
            BigInt(calculateSlippageAmount(amount, slippagePercent)[0].toString()),
            address,
            deadline.toBigInt(),
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addPoolAndBaseLiquidity', args }),
          })
        }
        else {
          const args: [Address, bigint[], bigint, Address, bigint] = [
            swap.contractAddress as Address,
            metaAmounts.map(amount => BigInt(amount.quotient.toString())),
            BigInt(calculateSlippageAmount(amount, slippagePercent)[0].toString()),
            address,
            deadline.toBigInt(),
          ]

          setRequest({
            account: address,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'addPoolLiquidity', args }),
          })
        }
      }
      catch (e: unknown) { }
    },
    [abi, address, chain?.id, contract, contractAddress, deadline, inputs.length, liquidity, slippagePercent, swap, useBase],
  )

  const {
    estimateGas,
    request,
    useSendTransactionReturn: {
      sendTransaction,
      isPending: isWritePending,
    },
  } = useSendTransaction({
    chainId,
    prepare,
    mutation: {
      onSettled,
      onSuccess: () => setOpen(false),
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
