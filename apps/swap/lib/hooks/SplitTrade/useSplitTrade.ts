import { SplitTrade } from '@zenlink-interface/amm'
import type { Amount, Type } from '@zenlink-interface/currency'
import { useCallback, useMemo } from 'react'
import { useQuery } from 'wagmi'
import type { z } from 'zod'
import { tradeValidator } from './validator'

export interface UseSplitTradeParams {
  chainId: number | undefined
  fromToken: Type | undefined
  toToken: Type | undefined
  amount: Amount<Type> | undefined
  gasPrice?: number
  recipient: string | undefined
  enabled: boolean
}

export interface UseSplitTradeReturn {
  trade: SplitTrade | undefined
  isLoading: boolean
  isError: boolean
}

export type UseSplitTradeQuerySelect = (data: SplitTradeType) => SplitTrade | undefined
export type SplitTradeType = z.infer<typeof tradeValidator>

function useSplitTradeQuery(
  {
    chainId,
    fromToken,
    toToken,
    amount,
    gasPrice = 50,
    recipient,
    enabled,
  }: UseSplitTradeParams,
  select: UseSplitTradeQuerySelect,
): UseSplitTradeReturn {
  const queryKey = useMemo(
    () => [
      'getTrade',
      { chainId, fromToken, toToken, amount, gasPrice, recipient, enabled },
    ],
    [amount, chainId, enabled, fromToken, gasPrice, recipient, toToken],
  )
  const { isLoading, data, isError } = useQuery(
    queryKey,
    {
      queryFn: async () => {
        const res = await (
          await fetch(
            `https://path-finder-orpin.vercel.app/v0?chainId=${chainId}&fromTokenId=${
              fromToken?.isNative ? 'Native' : fromToken?.wrapped.address
            }&toTokenId=${
              toToken?.isNative ? 'Native' : toToken?.wrapped.address
            }&amount=${amount?.quotient.toString()}&gasPrice=${gasPrice}${recipient ? `&to=${recipient}` : ''}`,
          )
        ).json()
        return tradeValidator.parse(res)
      },
      select,
      refetchInterval: 12000,
      enabled: Boolean(enabled && chainId && fromToken && toToken && amount && gasPrice && fromToken && toToken),
    },
  )

  return useMemo(() => ({ trade: data, isLoading, isError }), [data, isLoading, isError])
}

export function useSplitTrade(variables: UseSplitTradeParams) {
  const { chainId, fromToken, toToken, amount, enabled } = variables

  const select: UseSplitTradeQuerySelect = useCallback(
    (data) => {
      const legs = data.bestRoute.legs || []
      const writeArgs = Object.values(data.routeParams || {})
      if (!chainId || !fromToken || !toToken || !data || !amount || !enabled || !legs.length)
        return undefined

      return SplitTrade.bestTradeFromAPIRoute(
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

  return useSplitTradeQuery(variables, select)
}
