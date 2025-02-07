import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
import type { Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../../types'
import type { TokenOutput } from './types'
import { t } from '@lingui/core/macro'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { getMaturityFormatDate, type Market } from '@zenlink-interface/market'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { encodeFunctionData, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../../client'
import { useSendTransaction } from '../useSendTransaction'
import { SwapType } from './types'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'

interface UseRemoveManualReviewParams {
  chainId: ParachainId
  market: Market
  tokenRemoved: Amount<Token> | undefined
  ptRemoved: Amount<Token> | undefined
  lpToRemove: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

type UseRemoveManualReview = (params: UseRemoveManualReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveManualReview: UseRemoveManualReview = ({
  chainId,
  market,
  lpToRemove,
  tokenRemoved,
  ptRemoved,
  setOpen,
  onSuccess,
}) => {
  const { address } = useAccount()

  const [, { createNotification }] = useNotifications(address)
  const { address: contractAddress, abi } = getMarketActionRouterContract(chainId)
  const contract = useMarketActionRouterContract(chainId)
  const [{ slippageTolerance }] = useSettings()

  const onSettled = useCallback(
    (hash: SendTransactionData | undefined) => {
      if (!hash)
        return

      const ts = new Date().getTime()
      createNotification({
        type: 'burn',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Removing liquidity from the ${market.SY.yieldToken.symbol || 'symbol'} ${getMaturityFormatDate(market)} market`,
          completed: t`Successfully removed liquidity from the ${market.SY.yieldToken.symbol || 'symbol'} ${getMaturityFormatDate(market)} market`,
          failed: t`Something went wrong when removing liquidity`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    },
    [chainId, createNotification, market],
  )

  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  const prepare = useCallback(
    async (setRequest: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => {
      try {
        if (!lpToRemove || !tokenRemoved || !ptRemoved || !address || !contract)
          return

        const args: [Address, Address, bigint, TokenOutput, bigint] = [
          address,
          market.address as Address,
          BigInt(lpToRemove.quotient.toString()),
          {
            tokenOut: tokenRemoved.currency.address as Address,
            minTokenOut: BigInt(calculateSlippageAmount(tokenRemoved, slippagePercent)[0].toString()),
            tokenRedeemSy: market.SY.yieldToken.address as Address,
            zenlinkSwap: zeroAddress, // TODO: zenlink aggregator
            swapData: {
              swapType: SwapType.NONE,
              executor: zeroAddress,
              route: '0x',
            },
          },
          BigInt(calculateSlippageAmount(ptRemoved, slippagePercent)[0].toString()),
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'removeLiquidityDualTokenAndPt', args }),
        })
      }
      catch { }
    },
    [abi, address, contract, contractAddress, lpToRemove, market.SY.yieldToken.address, market.address, ptRemoved, slippagePercent, tokenRemoved],
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
