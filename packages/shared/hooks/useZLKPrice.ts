import { useMemo } from 'react'
import { useQuery } from 'wagmi'
import { ParachainId } from '@zenlink-interface/chain'

export const ZLK_ADDRESS_MAP = {
  [ParachainId.BIFROST_KUSAMA]: '2001-2-519',
  [ParachainId.ASTAR]: '0x998082c488e548820f970df5173bd2061ce90635',
  [ParachainId.MOONRIVER]: '0x0f47ba9d9bde3442b42175e51d6a367928a1173b',
  [ParachainId.MOONBEAM]: '0x3fd9b6c9a24e09f67b7b706d72864aebb439100c',

}

const QUERY_ENDPOINT = 'https://token-price-ruby.vercel.app'

export const useZLKPrice = () => {
  const queryKey = useMemo(() => [`${QUERY_ENDPOINT}/api/v0`], [])
  const {
    data,
    isError,
    isLoading,
  } = useQuery(
    queryKey,
    () => fetch(`${QUERY_ENDPOINT}/api/v0`).then(response => response.json()),
    { staleTime: 20000, enabled: true },
  )

  return useMemo(() => {
    const allPriceData = data && !isError && !isLoading
      ? data
      : {}
    const zlkChainPrice = Object.entries(allPriceData).map((item) => {
      const priceMap = JSON.parse(item[1] as string)
      const price = priceMap[ZLK_ADDRESS_MAP[Number(item[0]) as ParachainId]]
      return price
    }).filter(price => price)

    const avgZLKPrice = zlkChainPrice.length > 0 ? zlkChainPrice.reduce((total, price) => total + Number(price)) / zlkChainPrice.length : undefined
    return ({
      isError,
      isLoading,
      data:
      avgZLKPrice && !isError && !isLoading
        ? avgZLKPrice
        : undefined,
    })
  }, [isError, isLoading, data])
}
