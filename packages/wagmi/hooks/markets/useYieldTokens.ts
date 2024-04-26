import { useEffect, useMemo } from 'react'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { useReadContracts } from 'wagmi'
import type { Address } from 'viem'
import { JSBI } from '@zenlink-interface/math'
import type { PT, SYBase, YT } from '@zenlink-interface/market'
import { useBlockNumber } from '../useBlockNumber'
import { syBase, yt as ytABI } from '../../abis'
import { YieldTokensAddresses } from './config'

interface UseYieldTokensReturn {
  isLoading: boolean
  isError: boolean
  data: Record<Address, [SYBase, PT, YT]> | undefined
}

export function useYieldTokens(chainId: number | undefined, config?: { enabled?: boolean }): UseYieldTokensReturn {
  const blockNumber = useBlockNumber(chainId)
  const tokenEntities = useMemo(() => YieldTokensAddresses[chainId ?? -1], [chainId])

  const syCalls = useMemo(
    () => Object.values(tokenEntities).map(([sy]) => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: sy.address as Address,
      abi: syBase,
      functionName: 'exchangeRate',
    }) as const),
    [chainId, tokenEntities],
  )

  const ytCalls = useMemo(
    () => Object.values(tokenEntities).map(([, , yt]) => ({
      chainId: chainsParachainIdToChainId[chainId ?? -1],
      address: yt.address as Address,
      abi: ytABI,
      functionName: 'pyIndexStored',
    }) as const),
    [chainId, tokenEntities],
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
    Object.entries(tokenEntities).forEach(([marketAddress, [sy, pt, yt]], i) => {
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
  }, [isSyError, isSyLoading, isYtError, isYtLoading, syData, tokenEntities, ytData])
}
