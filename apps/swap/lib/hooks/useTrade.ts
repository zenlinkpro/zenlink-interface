import type { AggregatorTrade, Pair, StableSwap } from '@zenlink-interface/amm'
import { FACTORY_ADDRESS, Trade, TradeType } from '@zenlink-interface/amm'
import {
  PairState,
  StablePoolState,
  isSubstrateNetwork,
  useGetStablePools,
  usePairs,
} from '@zenlink-interface/compat'
import type { Amount, Type as Currency } from '@zenlink-interface/currency'
import { useCurrencyCombinations } from '@zenlink-interface/currency'
import { useDebounce } from '@zenlink-interface/hooks'
import { useMemo } from 'react'
import { AMM_ENABLED_NETWORKS } from 'config'
import { useTokens } from 'lib/state/token-lists'

export interface UseTradeOutput {
  trade: Trade | AggregatorTrade | undefined
}

export function useTrade(
  chainId: number | undefined,
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  _amountSpecified?: Amount<Currency>,
  mainCurrency?: Currency,
  otherCurrency?: Currency,
): UseTradeOutput {
  const [amountSpecified, currencyIn, currencyOut] = useDebounce(
    useMemo(
      () => (
        tradeType === TradeType.EXACT_INPUT
          ? [_amountSpecified, mainCurrency, otherCurrency]
          : [_amountSpecified, otherCurrency, mainCurrency]
      ),
      [_amountSpecified, mainCurrency, otherCurrency, tradeType],
    ),
    200,
  )
  const currencyCombinations = useCurrencyCombinations(chainId, currencyIn, currencyOut)
  const tokenMap = useTokens(chainId)

  const { data: pairs } = usePairs(chainId, currencyCombinations, {
    enabled: Boolean(chainId && AMM_ENABLED_NETWORKS.includes(chainId)),
  })

  const { data: stablePools } = useGetStablePools(chainId, tokenMap)

  const filteredPairs = useMemo(
    () => Object.values(
      pairs
        .filter((result): result is [PairState.EXISTS, Pair] =>
          Boolean(result[0] === PairState.EXISTS && result[1]))
        .map(([, pair]) => pair),
    ),
    [pairs],
  )

  const filteredStablePools = useMemo(
    () => Object.values(
      stablePools
        .filter((result): result is [StablePoolState.EXISTS, StableSwap] =>
          Boolean(result[0] === StablePoolState.EXISTS && result[1]))
        .map(([, stablePool]) => stablePool),
    ),
    [stablePools],
  )

  return useMemo(() => {
    if (
      currencyIn
      && currencyOut
      && currencyIn.wrapped.chainId === currencyOut.wrapped.chainId
      && currencyIn.wrapped.chainId === chainId
      && currencyOut.wrapped.chainId === chainId
      && currencyIn.wrapped.address !== currencyOut.wrapped.address
      && chainId
      && amountSpecified
      && amountSpecified.greaterThan(0)
      && filteredPairs.length > 0
    ) {
      if (chainId in FACTORY_ADDRESS || isSubstrateNetwork(chainId)) {
        const bestTrade = Trade.bestTradeExactIn(
          chainId,
          filteredPairs,
          filteredStablePools,
          amountSpecified,
          currencyOut,
        )[0]

        return { trade: bestTrade }
      }
    }

    return { trade: undefined }
  }, [amountSpecified, chainId, currencyIn, currencyOut, filteredPairs, filteredStablePools])
}
