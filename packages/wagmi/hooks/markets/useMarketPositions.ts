import type { Amount, Token, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import { useBalances } from '../useBalance'

interface MarketPosition {
  market: Market
  ptBalance: Amount<Type> | undefined
  ytBalance: Amount<Type> | undefined
  lpBalance: Amount<Type> | undefined
}

interface UseMarketPositionsReturn {
  isLoading: boolean
  isError: boolean
  data: MarketPosition[] | undefined
}

export function useMarketPositions(
  chainId: number | undefined,
  markets: Market[],
): UseMarketPositionsReturn {
  const { address: account } = useAccount()

  const currencies = useMemo(
    () => markets.map(market => [market.PT, market.YT, market] as Token[]).flat(),
    [markets],
  )

  const { data, isLoading, isError } = useBalances({ account, currencies, chainId })

  return useMemo(() => {
    if (!data)
      return { isLoading, isError, data: undefined }

    return {
      isLoading,
      isError,
      data: markets.map(market => ({
        market,
        ptBalance: data[market.PT.address],
        ytBalance: data[market.YT.address],
        lpBalance: data[market.address],
      })),
    }
  }, [data, isError, isLoading, markets])
}
