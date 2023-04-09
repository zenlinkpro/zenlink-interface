import type { TransactionRequest } from '@ethersproject/providers'
import type { SendTransactionResult } from '@wagmi/core'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Amount, Token } from '@zenlink-interface/currency'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { t } from '@lingui/macro'
import { calculateGasMargin } from '../calculateGasMargin'
import type { CalculatedStbaleSwapLiquidity, StableSwapWithBase } from '../types'
import { useSendTransaction } from './useSendTransaction'
import { useStableRouterContract } from './useStableRouter'
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
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [, { createNotification }] = useNotifications(address)
  const contract = useStableRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    (data: SendTransactionResult | undefined) => {
      if (!data || !swap || !poolName)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'mint',
        chainId,
        txHash: data.hash,
        promise: data.wait(),
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
    async (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
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
          const args = [
            swap.contractAddress,
            swap.baseSwap.contractAddress,
            metaAmounts.map(amount => amount.quotient.toString()),
            baseAmounts.map(amount => amount.quotient.toString()),
            calculateSlippageAmount(amount, slippagePercent)[0].toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addPoolAndBaseLiquidity(...args, {})
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addPoolAndBaseLiquidity', args),
            gasLimit: calculateGasMargin(gasLimit),
          })
        }
        else {
          const args = [
            swap.contractAddress,
            metaAmounts.map(amount => amount.quotient.toString()),
            calculateSlippageAmount(amount, slippagePercent)[0].toString(),
            address,
            deadline.toHexString(),
          ]

          const gasLimit = await contract.estimateGas.addPoolLiquidity(...args, {})
          setRequest({
            from: address,
            to: contract.address,
            data: contract.interface.encodeFunctionData('addPoolLiquidity', args),
            gasLimit: calculateGasMargin(gasLimit),
          })
        }
      }
      catch (e: unknown) { }
    },
    [address, chain?.id, contract, deadline, inputs.length, liquidity, slippagePercent, swap, useBase],
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess: () => setOpen(false),
  })

  return useMemo(() => ({
    isWritePending,
    sendTransaction: sendTransaction as (() => void) | undefined,
    routerAddress: contract?.address,
  }), [contract?.address, isWritePending, sendTransaction])
}
