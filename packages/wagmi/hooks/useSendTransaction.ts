import type { Dispatch, SetStateAction } from 'react'
import type { UseSendTransactionParameters } from 'wagmi'
import type { SendTransactionErrorType, SendTransactionParameters } from 'wagmi/actions'
import type { SendTransactionData } from 'wagmi/query'
import type { WagmiTransactionRequest } from '../types'
import { chainsParachainIdToChainId, isEvmNetwork } from '@zenlink-interface/chain'
import { createErrorToast } from '@zenlink-interface/ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TransactionExecutionError, UserRejectedRequestError } from 'viem'
import { useEstimateGas, useSendTransaction as useSendTransaction_ } from 'wagmi'
import { useBlockNumber } from './useBlockNumber'

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
  const blockNumber = useBlockNumber(chainId)
  chainId = chainsParachainIdToChainId[chainId && isEvmNetwork(chainId) ? chainId : -1]
  const [request, setRequest] = useState<WagmiTransactionRequest>()
  const { data: estimateGas } = useEstimateGas({
    ...request,
    chainId,
    query: {
      retry: true,
      retryDelay: 6000,
    },
  })

  const _onSettled = useCallback(
    async (
      hash: SendTransactionData | undefined,
      e: SendTransactionErrorType | null,
      variables: SendTransactionParameters,
      context: unknown,
    ) => {
      if (e) {
        if (e instanceof TransactionExecutionError && e.cause instanceof UserRejectedRequestError) {
          createErrorToast('User denied transaction signature.', true)
        }
        else {
          createErrorToast(e.message, true)
        }
      }

      if (onSettled)
        onSettled(hash, e, variables, context)
    },
    [onSettled],
  )

  useEffect(() => {
    if (enabled && blockNumber)
      prepare(setRequest)
  }, [blockNumber, enabled, prepare])

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
