import type { SubmittableExtrinsic } from '@polkadot/api/types'
import type { ExtrinsicStatus } from '@polkadot/types/interfaces'
import type { NotificationData } from '@zenlink-interface/ui'
import {
  createErrorToast,
  createFailedToast,
  createSuccessToast,
  toast,
} from '@zenlink-interface/ui'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { Account } from './useAccounts'
import { useApi } from './useApi'

export interface TransactionRequest {
  extrinsic?: SubmittableExtrinsic<'promise'>[] | null
  account?: Account
  notification: Omit<NotificationData, 'txHash' | 'promise'>
}

interface UseSendTransactionArgs {
  chainId?: number
  prepare: (setRequest: Dispatch<SetStateAction<TransactionRequest | undefined>>) => void
  createPendingNotification: (notification: Omit<NotificationData, 'promise'>) => void
  onSuccess: (status: ExtrinsicStatus) => void
}

export function useSendTransaction({ chainId, prepare, createPendingNotification, onSuccess }: UseSendTransactionArgs) {
  const api = useApi(chainId)
  const [request, setRequest] = useState<TransactionRequest>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    prepare(setRequest)
  }, [prepare])

  return useMemo(() => {
    const txs = request?.extrinsic
    if (!api || !txs?.length || !request || !request.account) {
      return {
        sendTransaction: undefined,
        isLoading: false,
      }
    }

    const { account, notification } = request
    const batchTx = api.tx.utility.batchAll(txs)
    let txHash: string | undefined
    const onDismiss = () => txHash ? toast.dismiss(txHash) : {}

    const sendTransactionFunction = async () => {
      const { address, signer } = account

      setIsLoading(true)

      try {
        const unsub = await batchTx.signAndSend(
          address,
          { nonce: -1, signer },
          ({ status }) => {
            setIsLoading(false)
            txHash = batchTx.hash.toString()

            if (status.isReady) {
              onSuccess(status)
              createPendingNotification({ ...notification, txHash })
            }

            if (status.isInBlock) {
              setTimeout(onDismiss, 3000)
              createSuccessToast({ ...notification, txHash })
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
          txHash && createFailedToast({ ...notification, txHash })
        }
      }
    }

    return {
      sendTransaction: sendTransactionFunction,
      isLoading,
    }
  }, [api, createPendingNotification, isLoading, onSuccess, request])
}
