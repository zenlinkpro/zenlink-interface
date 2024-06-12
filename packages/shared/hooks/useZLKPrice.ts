import { useQuery } from '@tanstack/react-query'
import type { ParachainId } from '@zenlink-interface/chain'
import { ZLK_ADDRESS } from '@zenlink-interface/currency'
import { useMemo } from 'react'

export function useZLKPrice() {
  const queryKey = useMemo(() => ['https://token-price.zenlink.pro/api/v0'], [])
  const {
    data,
    isError,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: () => fetch('https://token-price.zenlink.pro/api/v0').then(response => response.json()),
    staleTime: 20000,
    enabled: true,
  })

  return useMemo(() => {
    let numberOfChains = 0
    const totalPrice = Object.entries<string>(data || {}).reduce((acc, [chainId, prices]) => {
      const priceMap: Record<string, number> = JSON.parse(prices)
      const price = priceMap[ZLK_ADDRESS[Number(chainId) as ParachainId]]
      if (price) {
        numberOfChains += 1
        return acc + price
      }
      return acc
    }, 0)

    const avgPrice = numberOfChains ? totalPrice / numberOfChains : 0

    return ({
      isError,
      isLoading,
      data: avgPrice && !isError && !isLoading ? avgPrice : undefined,
    })
  }, [isError, isLoading, data])
}
