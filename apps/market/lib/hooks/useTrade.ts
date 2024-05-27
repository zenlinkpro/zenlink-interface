import { type AggregatorTrade, TradeVersion } from '@zenlink-interface/amm'
import type { Amount, Currency } from '@zenlink-interface/currency'
import { useDebounce } from '@zenlink-interface/hooks'
import type { Market } from '@zenlink-interface/market'
import { Trade } from '@zenlink-interface/market'
import { getSwapRouterContractConfig } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'

export interface UseTradeOutput {
  trade: Trade | undefined
}

export function useTrade(
  market: Market,
  _amountSpecified?: Amount<Currency>,
  _currencyOut?: Currency,
  aggregatorTrade?: AggregatorTrade | undefined,
): UseTradeOutput {
  const [amountSpecified, currencyOut] = useDebounce(
    useMemo(() => [_amountSpecified, _currencyOut], [_amountSpecified, _currencyOut]),
    200,
  )

  return useMemo(() => {
    if (
      amountSpecified
      && currencyOut
      && amountSpecified.greaterThan(0)
      && currencyOut.wrapped.address !== amountSpecified.currency.wrapped.address
    ) {
      const aggregationSwapData = aggregatorTrade
        ? {
            router: getSwapRouterContractConfig(market.chainId, TradeVersion.AGGREGATOR).address,
            executor: aggregatorTrade.writeArgs[0] as string,
            swapAmountIn: aggregatorTrade.inputAmount,
            swapAmountOut: aggregatorTrade.outputAmount,
            route: aggregatorTrade.writeArgs[2] as string,
          }
        : undefined
      const bestTrade = Trade.bestTradeExactIn(market, amountSpecified, currencyOut, aggregationSwapData)
      return { trade: bestTrade }
    }

    return { trade: undefined }
  }, [aggregatorTrade, amountSpecified, currencyOut, market])
}
