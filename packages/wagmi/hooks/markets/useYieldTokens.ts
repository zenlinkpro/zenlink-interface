import { useEffect, useMemo } from 'react'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useReadContracts } from 'wagmi'
import type { Address } from 'viem'
import { JSBI } from '@zenlink-interface/math'
import type { PT, SYBase, YT } from '@zenlink-interface/market'
import { useBlockNumber } from '../useBlockNumber'
import { syBase, yt as ytABI } from '../../abis'
import { YieldTokensEntities } from './config'

interface UseYieldTokensReturn {
  isLoading: boolean
  isError: boolean
  data: Record<Address, [SYBase, PT, YT]> | undefined
}

export function useYieldTokens(
  chainId: number | undefined,
  yiledTokensEntitiesInput?: Record<Address, [SYBase, PT, YT]> | undefined,
  config: { enabled?: boolean } = { enabled: true },
): UseYieldTokensReturn {
  const blockNumber = useBlockNumber(chainId)
  const yiledTokensEntities = useMemo(
    () => yiledTokensEntitiesInput || YieldTokensEntities[chainId ?? -1],
    [chainId, yiledTokensEntitiesInput],
  )

  const isEmptyEntities = Object.values(yiledTokensEntities)[0] === undefined

  const syCalls = useMemo(
    () => isEmptyEntities
      ? []
      : Object.values(yiledTokensEntities).map(([sy]) => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address: sy.address as Address,
        abi: syBase,
        functionName: 'exchangeRate',
      }) as const),
    [chainId, isEmptyEntities, yiledTokensEntities],
  )

  const ytPyIndexCalls = useMemo(
    () => isEmptyEntities
      ? []
      : Object.values(yiledTokensEntities).map(([, , yt]) => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address: yt.address as Address,
        abi: ytABI,
        functionName: 'pyIndexStored',
      }) as const),
    [chainId, isEmptyEntities, yiledTokensEntities],
  )

  const ytInterestIndexCalls = useMemo(
    () => isEmptyEntities
      ? []
      : Object.values(yiledTokensEntities).map(([, , yt]) => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address: yt.address as Address,
        abi: ytABI,
        functionName: 'globalInterestIndex',
      }) as const),
    [chainId, isEmptyEntities, yiledTokensEntities],
  )

  const ytTotalSupplyCalls = useMemo(
    () => isEmptyEntities
      ? []
      : Object.values(yiledTokensEntities).map(([, , yt]) => ({
        chainId: chainsParachainIdToChainId[chainId ?? -1],
        address: yt.address as Address,
        abi: ytABI,
        functionName: 'totalSupply',
      }) as const),
    [chainId, isEmptyEntities, yiledTokensEntities],
  )

  const {
    data: syData,
    isLoading: isSyLoading,
    isError: isSyError,
    refetch: refetchSy,
  } = useReadContracts({ contracts: syCalls })

  const {
    data: ytPyIndexData,
    isLoading: isYtPyIndexLoading,
    isError: isYtPyIndexError,
    refetch: refetchYtPyIndex,
  } = useReadContracts({ contracts: ytPyIndexCalls })

  const {
    data: ytInterestIndexData,
    isLoading: isYtInterestIndexLoading,
    isError: isYtInterestIndexError,
    refetch: refetchYtInterestIndex,
  } = useReadContracts({ contracts: ytInterestIndexCalls })

  const {
    data: ytSupplyData,
    isLoading: isYtSupplyLoading,
    isError: isYtSupplyError,
    refetch: refetchYtSupply,
  } = useReadContracts({ contracts: ytTotalSupplyCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber) {
      refetchSy()
      refetchYtPyIndex()
      refetchYtSupply()
      refetchYtInterestIndex()
    }
  }, [blockNumber, config?.enabled, refetchSy, refetchYtInterestIndex, refetchYtPyIndex, refetchYtSupply])

  return useMemo(() => {
    if (!syData || !ytPyIndexData || !ytSupplyData || !ytInterestIndexData || isEmptyEntities) {
      return {
        isLoading: isSyLoading || isYtPyIndexLoading || isYtInterestIndexLoading || isYtSupplyLoading,
        isError: isSyError || isYtPyIndexError || isYtInterestIndexError || isYtSupplyError,
        data: undefined,
      }
    }

    const res: Record<Address, [SYBase, PT, YT]> = {}
    Object.entries(yiledTokensEntities).forEach(([marketAddress, [sy, pt, yt]], i) => {
      const exchangeRate = syData[i].result
      const ytIndexStored = ytPyIndexData[i].result
      const ytTotalSupply = ytSupplyData[i].result
      const ytInterestIndex = ytInterestIndexData[i].result

      if (
        exchangeRate !== undefined
        && ytIndexStored !== undefined
        && ytTotalSupply !== undefined
        && ytInterestIndex !== undefined
      ) {
        sy.updateExchangeRate(JSBI.BigInt(exchangeRate.toString()))
        yt.updateState(
          JSBI.BigInt(ytIndexStored.toString()),
          JSBI.BigInt(ytInterestIndex.toString()),
          JSBI.BigInt(ytTotalSupply.toString()),
        )
        res[marketAddress as Address] = [sy, pt, yt]
      }
    })

    return {
      isLoading: isSyLoading || isYtPyIndexLoading || isYtInterestIndexLoading || isYtSupplyLoading,
      isError: isSyError || isYtPyIndexError || isYtInterestIndexError || isYtSupplyError,
      data: res,
    }
  }, [isEmptyEntities, isSyError, isSyLoading, isYtInterestIndexError, isYtInterestIndexLoading, isYtPyIndexError, isYtPyIndexLoading, isYtSupplyError, isYtSupplyLoading, syData, yiledTokensEntities, ytInterestIndexData, ytPyIndexData, ytSupplyData])
}

interface UseYieldTokensByMarketReturn {
  isLoading: boolean
  isError: boolean
  data: [SYBase, PT, YT] | undefined
}

export function useYieldTokensByMarket(
  chainId: number | undefined,
  marketAddress: Address,
  config: { enabled?: boolean } = { enabled: true },
): UseYieldTokensByMarketReturn {
  const yiledTokensEntitiesInput = useMemo(() => ({
    [marketAddress]: YieldTokensEntities[chainId ?? -1][marketAddress],
  }), [chainId, marketAddress])

  const { data, isLoading, isError } = useYieldTokens(chainId, yiledTokensEntitiesInput, config)

  return useMemo(() => ({
    isLoading,
    isError,
    data: data?.[marketAddress],
  }), [data, isError, isLoading, marketAddress])
}
