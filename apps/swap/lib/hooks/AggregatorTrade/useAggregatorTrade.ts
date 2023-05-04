import { AggregatorTrade } from '@zenlink-interface/amm'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'wagmi'
import type { z } from 'zod'
import { tradeValidator } from './validator'

export interface UseAggregatorTradeParams {
  chainId: number | undefined
  fromToken: Type | undefined
  toToken: Type | undefined
  amount: Amount<Type> | undefined
  gasPrice?: number
  recipient: string | undefined
  slippageTolerance: number
  enabled: boolean
}

export interface UseAggregatorTradeReturn {
  trade: AggregatorTrade | undefined
  isLoading: boolean
  isSyncing: boolean
  isError: boolean
}

export type UseAggregatorTradeQuerySelect = (data: AggregatorTradeType) => AggregatorTrade | undefined
export type AggregatorTradeType = z.infer<typeof tradeValidator>

function useAggregatorTradeQuery(
  {
    chainId,
    fromToken,
    toToken,
    amount,
    gasPrice = 10e9,
    recipient,
    enabled,
    slippageTolerance,
  }: UseAggregatorTradeParams,
  select: UseAggregatorTradeQuerySelect,
): UseAggregatorTradeReturn {
  const queryKey = useMemo(
    () => [
      'getTrade',
      { chainId, fromToken, toToken, amount, gasPrice, recipient, enabled },
    ],
    [amount, chainId, enabled, fromToken, gasPrice, recipient, toToken],
  )
  const { isLoading, data, isError, isRefetching: isSyncing } = useQuery(
    queryKey,
    {
      queryFn: async () => {
        const res = await (
          await fetch(
            `${
              process.env.NEXT_PUBLIC_SWAP_API_V0_BASE_URL || 'https://path-finder.zenlink.pro/v0'
            }?chainId=${chainId}&fromTokenId=${
              fromToken?.isNative ? 'Native' : fromToken?.wrapped.address
            }&toTokenId=${
              toToken?.isNative ? 'Native' : toToken?.wrapped.address
            }&amount=${amount?.quotient.toString()}&gasPrice=${gasPrice}&priceImpact=${
              slippageTolerance / 100
            }${recipient ? `&to=${recipient}` : ''}`,
          )
        ).json()
        return tradeValidator.parse(res)
      },
      select,
      refetchInterval: 12000,
      enabled: Boolean(enabled && chainId && fromToken && toToken && amount && gasPrice && fromToken && toToken),
    },
  )

  return useMemo(() => ({ trade: data, isLoading, isError, isSyncing }), [data, isLoading, isError, isSyncing])
}

export function useAggregatorTrade(variables: UseAggregatorTradeParams) {
  const { chainId, fromToken, toToken, amount, enabled } = variables

  const select: UseAggregatorTradeQuerySelect = useCallback(
    (data) => {
      const legs = data.bestRoute.legs || []
      let writeArgs: string[] = []
      if (data.routeParams) {
        const { tokenIn, amountIn, tokenOut, amountOutMin, to, routeCode } = data.routeParams
        writeArgs = [tokenIn, amountIn, tokenOut, amountOutMin, to, routeCode]
      }
      if (!chainId || !fromToken || !toToken || !data || !amount || !enabled || !legs.length)
        return undefined

      return AggregatorTrade.bestTradeFromAPIRoute(
        chainId,
        fromToken,
        toToken,
        data.bestRoute.amountInBN,
        data.bestRoute.amountOutBN,
        data.bestRoute.priceImpact,
        legs,
        writeArgs,
      )
    },
    [amount, chainId, enabled, fromToken, toToken],
  )

  return useAggregatorTradeQuery(variables, select)
}
