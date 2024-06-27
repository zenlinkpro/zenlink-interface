import type { Market, MarketRewardData } from '@zenlink-interface/market'
import { useEffect, useMemo } from 'react'
import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { useReadContracts } from 'wagmi'
import { JSBI } from '@zenlink-interface/math'
import { useBlockNumber } from '../useBlockNumber'
import { gaugeController } from '../../abis'

export const gaugeControllerContract: Record<number, Address> = {
  [ParachainId.MOONBEAM]: '0x9E713b76B86ce58feFB21Ad25D8764FEaa07681b',
}

interface UseRewardsDataReturn {
  isLoading: boolean
  isError: boolean
  data: MarketRewardData[]
}

export function useRewardsData(
  chainId: number | undefined,
  markets: Market[],
  config: { enabled?: boolean } = { enabled: true },
): UseRewardsDataReturn {
  const blockNumber = useBlockNumber(chainId)

  const rewardsCalls = useMemo(
    () => markets.map(market => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: gaugeControllerContract[chainId ?? -1],
      abi: gaugeController,
      functionName: 'rewardData',
      args: [market.address],
    }) as const),
    [chainId, markets],
  )

  const {
    data: rewardsData,
    isLoading,
    isError,
    refetch,
  } = useReadContracts({ contracts: rewardsCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber)
      refetch()
  }, [blockNumber, config?.enabled, refetch])

  return useMemo(() => {
    if (!rewardsData)
      return { isLoading, isError, data: [] }

    return {
      isLoading,
      isError,
      data: markets.map((_, i) => {
        const rewardData = rewardsData[i]?.result

        return {
          zlkPerSec: JSBI.BigInt(rewardData?.[0].toString() || 0),
          accumulatedZLK: JSBI.BigInt(rewardData?.[1].toString() || 0),
          lastUpdated: JSBI.BigInt(rewardData?.[2].toString() || 0),
          incentiveEndsAt: JSBI.BigInt(rewardData?.[3].toString() || 0),
        }
      }),
    }
  }, [isError, isLoading, markets, rewardsData])
}

interface UseRewardDataReturn {
  isLoading: boolean
  isError: boolean
  data: MarketRewardData | undefined
}

export function useRewardData(
  chainId: number | undefined,
  market?: Market,
  config: { enabled?: boolean } = { enabled: true },
): UseRewardDataReturn {
  const { data, isLoading, isError } = useRewardsData(
    chainId,
    useMemo(() => market ? [market] : [], [market]),
    config,
  )

  return useMemo(() => ({
    isLoading,
    isError,
    data: data[0],
  }), [data, isError, isLoading])
}
