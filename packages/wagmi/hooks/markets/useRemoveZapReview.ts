import type { AggregatorTrade } from '@zenlink-interface/amm'
import type { ParachainId } from '@zenlink-interface/chain'
import type { Amount, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import type { Dispatch, SetStateAction } from 'react'
import type { Address } from 'viem'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../../types'
import type { LimitOrderData, TokenOutput } from './types'
import { t } from '@lingui/core/macro'
import { calculateSlippageAmount, TradeVersion } from '@zenlink-interface/amm'
import { getMaturityFormatDate } from '@zenlink-interface/market'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { useCallback, useMemo } from 'react'
import { encodeFunctionData, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { config } from '../../client'
import { useSendTransaction } from '../useSendTransaction'
import { getSwapRouterContractConfig } from '../useSwapRouter'
import { SwapType } from './types'
import { getMarketActionRouterContract, useMarketActionRouterContract } from './useMarketActionRouter'

interface UseRemoveZapReviewParams {
  chainId: ParachainId
  market: Market
  trade: AggregatorTrade | undefined
  outputAmount: Amount<Type> | undefined
  lpToRemove: Amount<Type> | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  onSuccess: () => void
}

type UseRemoveZapReview = (params: UseRemoveZapReviewParams) => {
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
  routerAddress: string | undefined
}

export const useRemoveZapReview: UseRemoveZapReview = ({
  chainId,
  market,
  trade,
  outputAmount,
  lpToRemove,
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
        if (!lpToRemove || !outputAmount || !address || !contract)
          return

        const isNative = outputAmount.currency.isNative

        const args: [Address, Address, bigint, TokenOutput, LimitOrderData] = [
          address,
          market.address as Address,
          BigInt(lpToRemove.quotient.toString()),
          {
            tokenOut: isNative ? zeroAddress : outputAmount.currency.address as Address,
            minTokenOut: BigInt(calculateSlippageAmount(outputAmount, slippagePercent)[0].toString()),
            tokenRedeemSy: market.SY.yieldToken.address as Address,
            zenlinkSwap: trade
              ? getSwapRouterContractConfig(market.chainId, TradeVersion.AGGREGATOR).address as Address
              : zeroAddress,
            swapData: trade
              ? {
                  swapType: SwapType.ZENLINK,
                  executor: trade.writeArgs[0],
                  route: trade.writeArgs[2],
                }
              : {
                  swapType: SwapType.NONE,
                  executor: zeroAddress,
                  route: '0x',
                },
          },
          {
            limitRouter: zeroAddress,
            epsSkipMarket: BigInt(0),
            normalFills: [],
            flashFills: [],
            optData: '0x',
          },
        ]

        setRequest({
          account: address,
          to: contractAddress,
          data: encodeFunctionData({ abi, functionName: 'removeLiquiditySingleToken', args }),
        })
      }
      catch { }
    },
    [abi, address, contract, contractAddress, lpToRemove, market.SY.yieldToken.address, market.address, market.chainId, outputAmount, slippagePercent, trade],
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
