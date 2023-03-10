import { useMemo } from 'react'
import { useQuery } from 'wagmi'

// const QUERY_ENDPOINT = 'https://zenlink-stats-two.vercel.app'
const QUERY_ENDPOINT = 'http://localhost:3001'

export const useZLKStats = () => {
  const queryKey = useMemo(() => [`${QUERY_ENDPOINT}/api/v0`], [])
  const {
    data: zlkStatusData,
    isError,
    isLoading,
  } = useQuery(
    queryKey,
    () => fetch(`${QUERY_ENDPOINT}/api/v0`).then(response => response.json()),
    { staleTime: 20000, enabled: true },
  )

  return useMemo(() => ({
    isError,
    isLoading,
    data:
      zlkStatusData && !isError && !isLoading
        ? zlkStatusData.data
        : undefined,
  }), [isError, isLoading, zlkStatusData])
}
