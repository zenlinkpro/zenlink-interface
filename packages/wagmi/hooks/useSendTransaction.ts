import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useAccount, usePrepareSendTransaction, useSendTransaction as useSendTransaction_ } from 'wagmi'
import type { SendTransactionResult } from '@wagmi/core'
import { createErrorToast } from '@zenlink-interface/ui'
import type { UseSendTransactionArgs, UseSendTransactionConfig, WagmiTransactionRequest } from '../types'
import type { MultisigSafeConnector } from '../connectors/safe'

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

  const { connector } = useAccount()

  const _onSettled = useCallback(
    async (
      data: SendTransactionResult | undefined,
      e: Error | null,
      variables: UseSendTransactionArgs<'prepared' | undefined>,
      context: unknown,
    ) => {
      if (e)
        createErrorToast(e?.message, true)

      if (onSettled && connector) {
        if (connector.id === 'safe' && data) {
          const hash = await (connector as MultisigSafeConnector).getHashBySafeTxHash(data?.hash)
          data.hash = hash ?? data.hash
        }
        onSettled(data, e, variables, context)
      }
    },
    [connector, onSettled],
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
    onSettled: _onSettled,
  })
}
