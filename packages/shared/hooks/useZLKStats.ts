import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface ZLKInfo {
  holders: number
  totalBurn: string
  totalDistribute: string
  totalTvlUSD: string
  totalVolumeUSD: string
}

interface ZLKStats extends ZLKInfo {
  chainId: number
}

export function useZLKStats(): { isError: boolean, isLoading: boolean, data: ZLKStats[] | undefined } {
  const queryKey = useMemo(() => ['https://zenlink-stats.zenlink.pro/api/v0'], [])
  const {
    data: zlkStatusData,
    isError,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: () => fetch('https://zenlink-stats.zenlink.pro/api/v0').then(response => response.json()),
    staleTime: 20000,
    enabled: true,
  })

  return useMemo(() => ({
    isError,
    isLoading,
    data:
      zlkStatusData && !isError && !isLoading
        ? zlkStatusData.data.map(
            ({ chainId, zenlinkInfo }: { chainId: number, zenlinkInfo: ZLKInfo }) => ({ chainId, ...zenlinkInfo }),
          )
        : undefined,
  }), [isError, isLoading, zlkStatusData])
}
