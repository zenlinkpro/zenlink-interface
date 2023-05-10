import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { usePrepareSendTransaction, useSendTransaction as useSendTransaction_ } from 'wagmi'
import type { UseSendTransactionArgs, UseSendTransactionConfig, WagmiTransactionRequest } from '../types'

export function useSendTransaction<Args extends UseSendTransactionArgs = UseSendTransactionArgs>({
  chainId,
  onError,
  onMutate,
  onSuccess,
  onSettled,
  prepare,
  enabled = true,
}: Omit<Args & UseSendTransactionConfig, 'request' | 'mode'> & {
  prepare: (request: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => void
  enabled?: boolean
}) {
  chainId = chainsParachainIdToChainId[chainId ?? -1]
  const [request, setRequest] = useState<WagmiTransactionRequest>()
  const { config } = usePrepareSendTransaction({
    ...request,
    chainId,
    enabled,
  })

  useEffect(() => {
    prepare(setRequest)
  }, [prepare])

  return useSendTransaction_({
    ...config,
    chainId,
    onError,
    onMutate,
    onSuccess,
    onSettled,
  })
}
