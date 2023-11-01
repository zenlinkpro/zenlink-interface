import { useSettings } from '@zenlink-interface/shared'
import { useCurrentBlockTimestamp } from '@zenlink-interface/wagmi'
import type { BigNumber } from 'ethers'
import { useMemo } from 'react'

export function useTransactionDeadline(chainId: number | undefined, enabled = true) {
  const { data: blockTimestamp } = useCurrentBlockTimestamp(chainId, enabled)
  const [{ transactionDeadline: ttl }] = useSettings()
  return useMemo(() => {
    if (blockTimestamp && ttl && enabled)
      return (blockTimestamp as BigNumber).add(ttl * 60)
    return undefined
  }, [blockTimestamp, ttl, enabled])
}
