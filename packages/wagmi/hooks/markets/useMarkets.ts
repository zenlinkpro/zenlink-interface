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
  marketEntitiesInput?: Record<Address, Market> | undefined,
  yiledTokensEntitiesInput?: Record<Address, [SYBase, PT, YT]> | undefined,
  config: { enabled?: boolean } = { enabled: true },
): UseMarketsReturn {
  const blockNumber = useBlockNumber(chainId)
  const marketEntities = useMemo(
    () => marketEntitiesInput || MarketEntities[chainId ?? -1],
    [chainId, marketEntitiesInput],
  )

  const { data: yieldTokens } = useYieldTokens(chainId, yiledTokensEntitiesInput, config)

  const isEmptyEntities = Object.values(marketEntities)[0] === undefined

  const marketCalls = useMemo(
    () => isEmptyEntities
      ? []
      : Object.values(marketEntities).map(market => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address: market.address as Address,
        abi: marketABI,
        functionName: 'readState',
        args: [zeroAddress],
      }) as const),
    [chainId, isEmptyEntities, marketEntities],
  )

  const activeSupplyCalls = useMemo(
    () => isEmptyEntities
      ? []
      : Object.values(marketEntities).map(market => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address: market.address as Address,
        abi: marketABI,
        functionName: 'totalActiveSupply',
      }) as const),
    [chainId, isEmptyEntities, marketEntities],
  )

  const {
    data: marketData,
    isLoading: isMarketLoading,
    isError: isMarketError,
    refetch: refetchMarket,
  } = useReadContracts({ contracts: marketCalls })

  const {
    data: supplyData,
    isLoading: isSupplyLoading,
    isError: isSupplyError,
    refetch: refetchSupply,
  } = useReadContracts({ contracts: activeSupplyCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber) {
      refetchMarket()
      refetchSupply()
    }
  }, [blockNumber, config?.enabled, refetchMarket, refetchSupply])

  return useMemo(() => {
    if (!marketData || !supplyData || !yieldTokens) {
      return {
        isLoading: isMarketLoading || isSupplyLoading,
        isError: isMarketError || isSupplyError,
        data: undefined,
      }
    }

    const res = Object.entries(marketEntities).map(([marketAddress, market], i) => {
      const tokens = yieldTokens[marketAddress as Address]
      const marketState = marketData[i].result
      const activeSupply = supplyData[i].result

      if (tokens && marketState !== undefined && activeSupply !== undefined) {
        market.updateMarketState({
          totalPt: Amount.fromRawAmount(market.PT, marketState.totalPt.toString()),
          totalSy: Amount.fromRawAmount(market.SY, marketState.totalSy.toString()),
          totalLp: Amount.fromRawAmount(market, marketState.totalLp.toString()),
          scalarRoot: JSBI.BigInt(marketState.scalarRoot.toString()),
          lnFeeRateRoot: JSBI.BigInt(marketState.lnFeeRateRoot.toString()),
          reserveFeePercent: JSBI.BigInt(marketState.reserveFeePercent.toString()),
          lastLnImpliedRate: JSBI.BigInt(marketState.lastLnImpliedRate.toString()),
          totalActiveSupply: JSBI.BigInt(activeSupply.toString()),
        })
      }

      return market
    })

    return {
      isLoading: isMarketLoading || isSupplyLoading,
      isError: isMarketError || isSupplyError,
      data: res,
    }
  }, [isMarketError, isMarketLoading, isSupplyError, isSupplyLoading, marketData, marketEntities, supplyData, yieldTokens])
}

interface UseMarketReturn {
  isLoading: boolean
  isError: boolean
  data: Market | undefined
}

export function useMarket(
  chainId: number | undefined,
  marketAddress: Address,
  config: { enabled?: boolean } = { enabled: true },
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
