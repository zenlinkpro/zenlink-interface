import { ErrorCode } from '@ethersproject/logger'
import type { TransactionRequest } from '@ethersproject/providers'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { createErrorToast } from '@zenlink-interface/ui'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { ProviderRpcError } from 'wagmi'
import { usePrepareSendTransaction, useSendTransaction as useSendTransaction_ } from 'wagmi'
import type { SendTransactionArgs, SendTransactionResult } from 'wagmi/actions'
import type {
  UseSendTransactionArgs,
  UseSendTransactionConfig,
} from 'wagmi/dist/declarations/src/hooks/transactions/useSendTransaction'

export function useSendTransaction<Args extends UseSendTransactionArgs = UseSendTransactionArgs>({
  chainId,
  onError,
  onMutate,
  onSuccess,
  onSettled,
  prepare,
  enabled = true,
}: Omit<Args & UseSendTransactionConfig, 'request' | 'mode'> & {
  prepare: (request: Dispatch<SetStateAction<TransactionRequest & { to: string } | undefined>>) => void
  enabled?: boolean
}) {
  chainId = chainsParachainIdToChainId[chainId ?? -1]
  const [request, setRequest] = useState<TransactionRequest & { to: string }>()
  const { config } = usePrepareSendTransaction({
    request,
    chainId,
    enabled,
  })

  const _onSettled = useCallback(
    (
      data: SendTransactionResult | undefined,
      e: ProviderRpcError | Error | null,
      variables: SendTransactionArgs,
      context: unknown,
    ) => {
      // TODO: ignore until wagmi workaround on ethers error
      if (e?.message !== ErrorCode.ACTION_REJECTED)
        createErrorToast(e?.message, true)

      if (onSettled)
        onSettled(data, e, variables, context)
    },
    [onSettled],
  )

  useEffect(() => {
    prepare(setRequest)
  }, [prepare])

  return useSendTransaction_({
    ...config,
    chainId,
    onError,
    onMutate,
    onSuccess,
    // TODO: ignore until wagmi workaround on ethers error
    onSettled: _onSettled,
  })
}
