import { useEffect } from 'react'

import { useReadContract } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'
import { getMulticall3ContractConfig } from './useMulticall3Contract'

export function useCurrentBlockTimestamp(chainId: number | undefined, enabled = true) {
  const blockNumber = useBlockNumber(chainId)
  const { data, refetch } = useReadContract({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
  })
  useEffect(() => {
    if (blockNumber && enabled)
      refetch()
  }, [blockNumber, enabled, refetch])

  return data
}
