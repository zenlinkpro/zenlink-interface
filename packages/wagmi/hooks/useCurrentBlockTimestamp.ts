import { useReadContract } from 'wagmi'

import { useEffect } from 'react'
import { getMulticall3ContractConfig } from './useMulticall3Contract'
import { useBlockNumber } from './useBlockNumber'

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
