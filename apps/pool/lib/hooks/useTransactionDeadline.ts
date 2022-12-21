import type { BigNumber } from '@ethersproject/bignumber'
import { useSettings } from '@zenlink-interface/shared'
import { useCurrentBlockTimestamp } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'

export const useTransactionDeadline = (chainId: number, enabled = true): BigNumber | undefined => {
  const { data: blockTimestamp } = useCurrentBlockTimestamp(chainId, enabled)
  const [{ transactionDeadline: ttl }] = useSettings()
  return useMemo(() => {
    if (blockTimestamp && ttl && enabled)
      return (blockTimestamp as BigNumber).add(ttl * 60)
    return undefined
  }, [blockTimestamp, enabled, ttl])
}
