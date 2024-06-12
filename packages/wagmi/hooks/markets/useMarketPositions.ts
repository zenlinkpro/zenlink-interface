import type { Amount, Token, Type } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import { useBalances } from '../useBalance'

export interface MarketPosition {
  id: string
  market: Market
  syBalance: Amount<Type> | undefined
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
    () => markets.map(market => [market.SY, market.PT, market.YT, market] as Token[]).flat(),
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
        id: market.address,
        market,
        syBalance: data[market.SY.address],
        ptBalance: data[market.PT.address],
        ytBalance: data[market.YT.address],
        lpBalance: data[market.address],
      })),
    }
  }, [data, isError, isLoading, markets])
}
