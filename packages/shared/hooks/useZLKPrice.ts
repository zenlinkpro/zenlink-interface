import { useMemo } from 'react'
import { useQuery } from 'wagmi'
import { ZLK_ADDRESS } from '@zenlink-interface/currency'
import type { ParachainId } from '@zenlink-interface/chain'

export const useZLKPrice = () => {
  const queryKey = useMemo(() => ['https://token-price.zenlink.pro/api/v0'], [])
  const {
    data,
    isError,
    isLoading,
  } = useQuery(
    queryKey,
    () => fetch('https://token-price.zenlink.pro/api/v0').then(response => response.json()),
    { staleTime: 20000, enabled: true },
  )

  return useMemo(() => {
    const numberOfChains = Object.keys(data || {}).length
    const avgPrice = Object.entries<string>(data || {}).reduce((acc, [chainId, prices]) => {
      const priceMap: Record<string, number> = JSON.parse(prices)
      const price = priceMap[ZLK_ADDRESS[Number(chainId) as ParachainId]]
      if (price)
        return acc + price
      return acc
    }, 0) / numberOfChains

    return ({
      isError,
      isLoading,
      data: avgPrice && !isError && !isLoading ? avgPrice : undefined,
    })
  }, [isError, isLoading, data])
}
