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
  // const txs = useTxBatch(chainId, request?.extrinsic, { type: 'all' })
  const txs = request?.extrinsic
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

    const { account, notification } = request
    const batchTx = api.tx.utility.batchAll(txs)
    let txHash: string | undefined
    const onDismiss = () => txHash ? toast.dismiss(txHash) : {}

    const sendTransactionFunction = async () => {
      const { web3FromSource } = await import('@polkadot/extension-dapp')
      const { address, source } = account
      const injector = await web3FromSource(source)

      setIsLoading(true)

      try {
        const unsub = await batchTx.signAndSend(
          address,
          { nonce: -1, signer: injector.signer },
          ({ status, events }) => {
            setIsLoading(false)
            txHash = batchTx.hash.toString()

            // window.console.log(`txHash: ${txHash}, isInBlock: ${status.isInBlock}, isReady: ${status.isReady}, isFinalized: ${status.isFinalized}`)

            if (status.isInBlock) {
              for (const event of events) {
                if (api.events.utility.BatchInterrupted.is(event.event)) {
                  setTimeout(onDismiss, 600)
                  txHash && createFailedToast({ ...notification, txHash })
                  unsub()
                  return
                }
              }
            }

            if (status.isReady) {
              onSuccess(status)
              createPendingNotification({ ...notification, txHash })
            }

            if (status.isInBlock || status.isFinalized) {
              setTimeout(onDismiss, 600)
              createSuccessToast({ ...notification, txHash })
              unsub()
            }
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
  }, [api, createPendingNotification, isLoading, onSuccess, request, txs])
}
