import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { UseSendTransactionParameters } from 'wagmi'
import { useEstimateGas, useSendTransaction as useSendTransaction_ } from 'wagmi'
import { createErrorToast } from '@zenlink-interface/ui'
import type { SendTransactionData } from 'wagmi/query'
import type { SendTransactionErrorType } from 'wagmi/actions'
import type { WagmiTransactionRequest } from '../types'

export function useSendTransaction<Args extends UseSendTransactionParameters = UseSendTransactionParameters>({
  chainId,
  mutation,
  prepare,
  enabled = true,
}: Args & {
  chainId: number | undefined
  prepare: (request: Dispatch<SetStateAction<WagmiTransactionRequest | undefined>>) => void
  enabled?: boolean
}) {
  const { onError, onMutate, onSettled, onSuccess } = mutation || {}
  chainId = chainsParachainIdToChainId[chainId ?? -1]
  const [request, setRequest] = useState<WagmiTransactionRequest>()
  const { data: estimateGas } = useEstimateGas({
    ...request,
    chainId,
  })

  const _onSettled = useCallback(
    async (
      hash: SendTransactionData | undefined,
      e: SendTransactionErrorType | null,
      variables: WagmiTransactionRequest,
      context: unknown,
    ) => {
      if (e)
        createErrorToast(e.message, true)

      if (onSettled)
        onSettled(hash, e, variables, context)
    },
    [onSettled],
  )

  useEffect(() => {
    if (enabled)
      prepare(setRequest)
  }, [enabled, prepare])

  const useSendTransactionReturn = useSendTransaction_({
    mutation: {
      onError,
      onMutate,
      onSuccess,
      onSettled: _onSettled,
    },
  })

  return useMemo(() => ({
    request,
    estimateGas,
    useSendTransactionReturn,
  }), [estimateGas, request, useSendTransactionReturn])
}
