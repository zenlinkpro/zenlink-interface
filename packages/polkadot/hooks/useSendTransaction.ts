import type { SubmittableExtrinsic } from '@polkadot/api/types'
import type { NotificationData } from '@zenlink-interface/ui'
import {
  createErrorToast,
  createFailedToast,
  createSuccessToast,
  toast,
} from '@zenlink-interface/ui'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useApi } from './useApi'
import { useTxBatch } from './useTxBatch'

export interface TransactionRequest {
  extrinsic?: SubmittableExtrinsic<'promise'>[] | null
  account?: string
  notification: Omit<NotificationData, 'txHash' | 'promise'>
}

interface UseSendTransactionArgs {
  chainId: number
  prepare: (setRequest: Dispatch<SetStateAction<TransactionRequest | undefined>>) => void
  createPendingNotification: (notification: Omit<NotificationData, 'promise'>) => void
}

export function useSendTransaction({ chainId, prepare, createPendingNotification }: UseSendTransactionArgs) {
  const api = useApi(chainId)
  const [request, setRequest] = useState<TransactionRequest>()
  const txs = useTxBatch(chainId, request?.extrinsic, { type: 'all' })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    prepare(setRequest)
  }, [prepare])

  return useMemo(() => {
    if (!api || !txs?.length || !request || !request.account) {
      return {
        sendTransaction: undefined,
        isLoading: false,
      }
    }

    const batchTx = api.tx.utility.batchAll(txs)
    const txHash = batchTx.hash.toString()
    const onDismiss = () => toast.dismiss(txHash)
    const sendTransactionFunction = async () => {
      setIsLoading(true)
      try {
        const unsub = await batchTx.signAndSend(request.account!, ({ status }) => {
          setIsLoading(false)
          if (status.isReady)
            createPendingNotification({ ...request.notification, txHash })
          if (status.isInBlock) {
            setTimeout(onDismiss, 3000)
            createSuccessToast({ ...request.notification, txHash })
          }
          if (status.isFinalized)
            unsub()
        })
      }
      catch (e: any) {
        setIsLoading(false)
        if (e?.message === 'Cancelled') {
          createErrorToast(e?.message, true)
        }
        else {
          setTimeout(onDismiss, 3000)
          createFailedToast({ ...request.notification, txHash })
        }
      }
    }

    return {
      sendTransaction: sendTransactionFunction,
      isLoading,
    }
  }, [api, createPendingNotification, isLoading, request, txs])
}
