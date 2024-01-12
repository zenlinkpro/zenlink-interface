import { useSettings } from '@zenlink-interface/shared'
import { useCurrentBlockTimestamp } from '@zenlink-interface/wagmi'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'

export function useTransactionDeadline(chainId: number | undefined, enabled = true) {
  const blockTimestamp = useCurrentBlockTimestamp(chainId, enabled)
  const [{ transactionDeadline: ttl }] = useSettings()
  return useMemo(() => {
    if (blockTimestamp && ttl && enabled)
      return BigNumber.from(blockTimestamp).add(ttl * 60)
    return undefined
  }, [blockTimestamp, ttl, enabled])
}
