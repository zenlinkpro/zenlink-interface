import type { Amount, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { SendTransactionData } from 'wagmi/query'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { Percent } from '@zenlink-interface/math'
import type { Address } from 'viem'
import { encodeFunctionData, zeroAddress } from 'viem'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { config } from '../../client'
import type { WagmiTransactionRequest } from '../../types'
import { useSendTransaction } from '../useSendTransaction'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'
import type { TokenInput, TokenOutput } from './types'
import { SwapType } from './types'

interface UseMarketWrapReviewParams {
  chainId: number | undefined
  market: Market
  wrap: boolean
  inputAmount: Amount<Type> | undefined
  outputAmount: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

type UseMarketWrapReview = (params: UseMarketWrapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useMarketWrapReview: UseMarketWrapReview = ({
  chainId,
  setOpen,
  onSuccess,
  market,
  wrap,
  inputAmount,
  outputAmount,
}) => {
  const { address: account } = useAccount()
  const [, { createNotification }] = useNotifications(account)

  const { address: contractAddress, abi } = getMarketActionRouterContract(chainId)
  const contract = useMarketActionRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    async (hash: SendTransactionData | undefined) => {
      if (!chainId || !hash || !inputAmount)
        return

      const ts = new Date().getTime()

      createNotification({
        type: wrap ? 'enterBar' : 'leaveBar',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: `${wrap ? 'Wrapping' : 'Unwrapping'} ${inputAmount.toSignificant(6)} ${inputAmount.currency.symbol}`,
          completed: `Successfully ${wrap ? 'wrapped' : 'unwrapped'} ${inputAmount.toSignificant(6)} ${inputAmount.currency.symbol}`,
          failed: `Something went wrong when trying to ${wrap ? 'wrap' : 'unwrap'}`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, inputAmount, wrap],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (!inputAmount || !outputAmount || !account || !contract)
          return

        if (wrap) {
          const args: [Address, Address, bigint, TokenInput] = [
            account,
            market.SY.address as Address,
            BigInt(calculateSlippageAmount(outputAmount, slippagePercent)[0].toString()),
            {
              tokenIn: inputAmount.currency.wrapped.address as Address,
              netTokenIn: BigInt(inputAmount.quotient.toString()),
              tokenMintSy: market.SY.yieldToken.address as Address,
              zenlinkSwap: zeroAddress,
              swapData: {
                swapType: SwapType.NONE,
                executor: zeroAddress,
                route: '0x',
              },
            },
          ]

          setRequest({
            account,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'mintSyFromToken', args }),
          })
        }
        else {
          const args: [Address, Address, bigint, TokenOutput] = [
            account,
            market.SY.address as Address,
            BigInt(inputAmount.quotient.toString()),
            {
              tokenOut: outputAmount.currency.wrapped.address as Address,
              minTokenOut: BigInt(calculateSlippageAmount(outputAmount, slippagePercent)[0].toString()),
              tokenRedeemSy: market.SY.yieldToken.address as Address,
              zenlinkSwap: zeroAddress,
              swapData: {
                swapType: SwapType.NONE,
                executor: zeroAddress,
                route: '0x',
              },
            },
          ]

          setRequest({
            account,
            to: contractAddress,
            data: encodeFunctionData({ abi, functionName: 'redeemSyToToken', args }),
          })
        }
      }
      catch {}
    },
    [abi, account, contract, contractAddress, inputAmount, market.SY.address, market.SY.yieldToken.address, outputAmount, slippagePercent, wrap],
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
      onSuccess: () => {
        setOpen(false)
        onSuccess()
      },
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
