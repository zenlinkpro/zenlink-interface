import { useContractRead } from 'wagmi'

import { getMulticall3ContractConfig } from './useMulticall3Contract'
import type {} from '@tanstack/react-query'

export const useCurrentBlockTimestamp = (chainId: number | undefined, enabled = true) => {
  return useContractRead({
    ...getMulticall3ContractConfig(chainId),
    functionName: 'getCurrentBlockTimestamp',
    enabled,
    watch: true,
  })
}
