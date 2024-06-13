import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Token } from '@zenlink-interface/currency'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { type Dispatch, type SetStateAction, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { SendTransactionData } from 'wagmi/query'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { t } from '@lingui/macro'
import { Percent, ZERO } from '@zenlink-interface/math'
import type { Address } from 'viem'
import { encodeFunctionData, zeroAddress } from 'viem'
import { calculateSlippageAmount } from '@zenlink-interface/amm'
import { config } from '../../client'
import type { WagmiTransactionRequest } from '../../types'
import { useSendTransaction } from '../useSendTransaction'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'
import { SwapType, type TokenInput } from './types'

interface UseAddManualReviewParams {
  chainId: ParachainId
  market: Market
  tokenAmount: Amount<Token> | undefined
  ptAmount: Amount<Token> | undefined
  lpMinted: Amount<Token>
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

type UseAddManualReview = (params: UseAddManualReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useAddManualReview: UseAddManualReview = ({
  chainId,
  market,
  tokenAmount,
  ptAmount,
  lpMinted,
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
        type: 'mint',
        chainId,
        txHash: hash,
        promise: waitForTransactionReceipt(config, { hash }),
        summary: {
          pending: t`Adding liquidity to the ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)} market`,
          completed: t`Successfully added liquidity to the ${market.SY.yieldToken.symbol} ${getMaturityFormatDate(market)} market`,
          failed: t`Something went wrong when adding liquidity`,
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
        if (!tokenAmount || !ptAmount || lpMinted.equalTo(ZERO) || !address || !contract)
          return

        const args: [Address, Address, TokenInput, bigint, bigint] = [
          address,
          market.address as Address,
          {
            tokenIn: tokenAmount.currency.address as Address,
            netTokenIn: BigInt(tokenAmount.quotient.toString()),
            tokenMintSy: market.SY.yieldToken.address as Address,
            zenlinkSwap: zeroAddress, // TODO: zenlink aggregator
            swapData: {
              swapType: SwapType.NONE,
              executor: zeroAddress,
              route: '0x',
            },
          },
          BigInt(ptAmount.quotient.toString()),
          BigInt(calculateSlippageAmount(lpMinted, slippagePercent)[0].toString()),
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'addLiquidityDualTokenAndPt', args }),
        })
      }
      catch (e: unknown) { }
    },
    [abi, address, contract, contractAddress, lpMinted, market.SY.yieldToken.address, market.address, ptAmount, slippagePercent, tokenAmount],
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
