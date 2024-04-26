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
  yiledTokensEntitiesInput: Record<Address, [SYBase, PT, YT]> | undefined,
  config?: { enabled?: boolean },
): UseYieldTokensReturn {
  const blockNumber = useBlockNumber(chainId)
  const yiledTokensEntities = useMemo(
    () => yiledTokensEntitiesInput || YieldTokensEntities[chainId ?? -1],
    [chainId, yiledTokensEntitiesInput],
  )

  const syCalls = useMemo(
    () => Object.values(yiledTokensEntities).map(([sy]) => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: sy.address as Address,
      abi: syBase,
      functionName: 'exchangeRate',
    }) as const),
    [chainId, yiledTokensEntities],
  )

  const ytCalls = useMemo(
    () => Object.values(yiledTokensEntities).map(([, , yt]) => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: yt.address as Address,
      abi: ytABI,
      functionName: 'pyIndexStored',
    }) as const),
    [chainId, yiledTokensEntities],
  )

  const {
    data: syData,
    isLoading: isSyLoading,
    isError: isSyError,
    refetch: refetchSy,
  } = useReadContracts({ contracts: syCalls })
  const {
    data: ytData,
    isLoading: isYtLoading,
    isError: isYtError,
    refetch: refetchYt,
  } = useReadContracts({ contracts: ytCalls })

  useEffect(() => {
    if (config?.enabled && blockNumber) {
      refetchSy()
      refetchYt()
    }
  }, [blockNumber, config?.enabled, refetchSy, refetchYt])

  return useMemo(() => {
    if (!syData || !ytData) {
      return {
        isLoading: isSyLoading || isYtLoading,
        isError: isSyError || isYtError,
        data: undefined,
      }
    }

    const res: Record<Address, [SYBase, PT, YT]> = {}
    Object.entries(yiledTokensEntities).forEach(([marketAddress, [sy, pt, yt]], i) => {
      const exchangeRate = syData[i].result
      const pyIndexStored = ytData[i].result

      if (exchangeRate !== undefined && pyIndexStored !== undefined) {
        sy.updateExchangeRate(JSBI.BigInt(exchangeRate.toString()))
        yt.updatePyIndexStored(JSBI.BigInt(pyIndexStored.toString()))
        res[marketAddress as Address] = [sy, pt, yt]
      }
    })

    return {
      isLoading: isSyLoading || isYtLoading,
      isError: isSyError || isYtError,
      data: res,
    }
  }, [isSyError, isSyLoading, isYtError, isYtLoading, syData, yiledTokensEntities, ytData])
}

interface UseYieldTokensByMarketReturn {
  isLoading: boolean
  isError: boolean
  data: [SYBase, PT, YT] | undefined
}

export function useYieldTokensByMarket(
  chainId: number | undefined,
  marketAddress: Address,
  config?: { enabled?: boolean },
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
