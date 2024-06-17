import { useAccount, useReadContracts } from 'wagmi'
import type { Market } from '@zenlink-interface/market'
import { useEffect, useMemo } from 'react'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Address } from 'viem'
import { useBlockNumber } from '../useBlockNumber'
import { market as marketABI } from '../../abis'

interface UseMarketActiveBalancesReturn {
  isLoading: boolean
  isError: boolean
  data: bigint[] | undefined
}

export function useMarketActiveBalances(
  chainId: number | undefined,
  markets: Market[],
  config: { enabled?: boolean } = { enabled: true },
): UseMarketActiveBalancesReturn {
  const { address: account } = useAccount()
  const blockNumber = useBlockNumber(chainId)

  const activeBalanceCalls = useMemo(
    () => markets.map(market => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: market.address as Address,
      abi: marketABI,
      functionName: 'activeBalance',
      args: [account],
    }) as const),
    [account, chainId, markets],
  )

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useReadContracts({ contracts: activeBalanceCalls })

  useEffect(() => {
    if (config.enabled && account && blockNumber) {
      refetch()
    }
  }, [account, blockNumber, config.enabled, refetch])

  return useMemo(() => {
    if (!data) {
      return {
        isLoading,
        isError,
        data: undefined,
      }
    }

    return {
      isLoading,
      isError,
      data: markets.map((_, i) => {
        const d = data[i]
        if (d.result !== undefined) {
          return d.result
        }
        else {
          return BigInt(0)
        }
      }),
    }
  }, [data, isError, isLoading, markets])
}
