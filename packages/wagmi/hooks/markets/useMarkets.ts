import { useEffect, useMemo } from 'react'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { zeroAddress } from 'viem'
import { useReadContracts } from 'wagmi'
import { Amount } from '@zenlink-interface/currency'
import { JSBI } from '@zenlink-interface/math'
import type { Market, PT, SYBase, YT } from '@zenlink-interface/market'
import { useBlockNumber } from '../useBlockNumber'
import { market as marketABI } from '../../abis'
import { MarketEntities, YieldTokensEntities } from './config'
import { useYieldTokens } from './useYieldTokens'

interface UseMarketsReturn {
  isLoading: boolean
  isError: boolean
  data: Market[] | undefined
}

export function useMarkets(
  chainId: number | undefined,
  marketEntitiesInput: Record<Address, Market> | undefined,
  yiledTokensEntitiesInput: Record<Address, [SYBase, PT, YT]> | undefined,
  config?: { enabled?: boolean },
): UseMarketsReturn {
  const blockNumber = useBlockNumber(chainId)
  const marketEntities = useMemo(
    () => marketEntitiesInput || MarketEntities[chainId ?? -1],
    [chainId, marketEntitiesInput],
  )

  const { data: yieldTokens } = useYieldTokens(chainId, yiledTokensEntitiesInput, config)

  const marketCalls = useMemo(
    () => Object.values(marketEntities).map(market => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: market.address as Address,
      abi: marketABI,
      functionName: 'readState',
      args: [zeroAddress],
    }) as const),
    [chainId, marketEntities],
  )

  const { data, isLoading, isError, refetch } = useReadContracts({ contracts: marketCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber)
      refetch()
  }, [blockNumber, config?.enabled, refetch])

  return useMemo(() => {
    if (!data || !yieldTokens)
      return { isLoading, isError, data: undefined }

    const res = Object.entries(marketEntities).map(([marketAddress, market], i) => {
      const tokens = yieldTokens[marketAddress as Address]
      const marketState = data[i].result

      if (tokens && marketState !== undefined) {
        market.updateMarketState({
          totalPt: Amount.fromRawAmount(market.PT, marketState.totalPt.toString()),
          totalSy: Amount.fromRawAmount(market.SY, marketState.totalSy.toString()),
          totalLp: Amount.fromRawAmount(market, marketState.totalLp.toString()),
          scalarRoot: JSBI.BigInt(marketState.scalarRoot.toString()),
          lnFeeRateRoot: JSBI.BigInt(marketState.lnFeeRateRoot.toString()),
          reserveFeePercent: JSBI.BigInt(marketState.reserveFeePercent.toString()),
          lastLnImpliedRate: JSBI.BigInt(marketState.lastLnImpliedRate.toString()),
        })
      }

      return market
    })

    return {
      isLoading,
      isError,
      data: res,
    }
  }, [data, isError, isLoading, marketEntities, yieldTokens])
}

interface UseMarketReturn {
  isLoading: boolean
  isError: boolean
  data: Market | undefined
}

export function useMarket(
  chainId: number | undefined,
  marketAddress: Address,
  config?: { enabled?: boolean },
): UseMarketReturn {
  const marketEntitiesInput = useMemo(() => ({
    [marketAddress]: MarketEntities[chainId ?? -1][marketAddress],
  }), [chainId, marketAddress])
  const yiledTokensEntitiesInput = useMemo(() => ({
    [marketAddress]: YieldTokensEntities[chainId ?? -1][marketAddress],
  }), [chainId, marketAddress])

  const { data, isLoading, isError } = useMarkets(
    chainId,
    marketEntitiesInput,
    yiledTokensEntitiesInput,
    config,
  )

  return useMemo(() => ({
    isLoading,
    isError,
    data: data?.[0],
  }), [data, isError, isLoading])
}
