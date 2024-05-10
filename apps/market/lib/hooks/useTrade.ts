import type { Amount, Currency } from '@zenlink-interface/currency'
import { useDebounce } from '@zenlink-interface/hooks'
import type { Market } from '@zenlink-interface/market'
import { Trade } from '@zenlink-interface/market'
import { useMemo } from 'react'

export interface UseTradeOutput {
  trade: Trade | undefined
}

export function useTrade(
  market: Market,
  _amountSpecified?: Amount<Currency>,
  _currencyOut?: Currency,
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
      const bestTrade = Trade.bestTradeExactIn(market, amountSpecified, currencyOut)
      return { trade: bestTrade }
    }

    return { trade: undefined }
  }, [amountSpecified, currencyOut, market])
}
