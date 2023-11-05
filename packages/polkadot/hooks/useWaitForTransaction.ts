import type { Status } from '@zenlink-interface/graph-client'
import { txStatus } from '@zenlink-interface/graph-client'
import { useEffect, useState } from 'react'

export function useWaitForTransaction(chainId: number, hash: string) {
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    txStatus(chainId, hash, setStatus)
  }, [chainId, hash])

  return { status }
}
