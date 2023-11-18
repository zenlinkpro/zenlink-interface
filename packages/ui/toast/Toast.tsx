import type { ParachainId } from '@zenlink-interface/chain'
import { nanoid } from 'nanoid'
import type { ReactNode } from 'react'
import type { ToastOptions } from 'react-toastify'
import { toast } from 'react-toastify'

import { ToastButtons } from './ToastButtons'
import { ToastCompleted } from './ToastCompleted'
import { ToastContent } from './ToastContent'
import { ToastFailed } from './ToastFailed'
import { ToastInfo } from './ToastInfo'
import { ToastInline } from './ToastInline'
import { ToastPending } from './ToastPending'

export const TOAST_OPTIONS: ToastOptions = {
  position: 'top-right',
  autoClose: false,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  closeButton: false,
  icon: false,
}

export interface NotificationData {
  type:
    | 'send'
    | 'swap'
    | 'mint'
    | 'burn'
    | 'approval'
    | 'enterBar'
    | 'leaveBar'
    | 'generateCode'
    | 'setCode'
  chainId: ParachainId
  summary: {
    pending: ReactNode | Array<ReactNode>
    completed: ReactNode | Array<ReactNode>
    failed: ReactNode | Array<ReactNode>
    info?: ReactNode | Array<ReactNode>
  }
  href?: string
  txHash: string
  groupTimestamp: number
  timestamp: number
  promise: Promise<any>
}

export function createInlineToast(props: NotificationData) {
  const onDismiss = () => toast.dismiss(props.txHash)

  return toast(<ToastInline {...props} onDismiss={onDismiss} />, {
    ...TOAST_OPTIONS,
    toastId: props.txHash,
  })
}

export function createToast(props: NotificationData) {
  const onDismiss = () => toast.dismiss(props.txHash)

  // Spawn new toasts based on promise result
  props.promise
    .then(() => {
      setTimeout(onDismiss, 3000)

      // Spawn success notification
      const toastId = `completed:${props.txHash}`
      toast(<ToastCompleted {...props} onDismiss={() => toast.dismiss(toastId)} />, {
        ...TOAST_OPTIONS,
        toastId,
        autoClose: 5000,
      })
    })
    .catch(() => {
      setTimeout(onDismiss, 3000)

      // Spawn error notification
      const toastId = `failed:${props.txHash}`
      toast(<ToastFailed {...props} onDismiss={() => toast.dismiss(toastId)} />, {
        ...TOAST_OPTIONS,
        toastId,
      })
    })

  return toast(<ToastPending {...props} onDismiss={onDismiss} />, {
    ...TOAST_OPTIONS,
    toastId: props.txHash,
  })
}

export function createErrorToast(message: string | undefined, code: boolean) {
  if (!message)
    return

  const toastId = `failed:${nanoid()}`
  toast(
    <>
      <ToastContent code={code} summary={message} title="Error Occurred" />
      <ToastButtons onDismiss={() => toast.dismiss(toastId)} />
    </>,
    {
      ...TOAST_OPTIONS,
      toastId,
    },
  )
}

export function createPendingToast(props: Omit<NotificationData, 'promise'>) {
  const toastId = props.txHash
  toast(<ToastPending {...props} onDismiss={() => toast.dismiss(toastId)} />, {
    ...TOAST_OPTIONS,
    toastId,
  })
}

export function createSuccessToast(props: Omit<NotificationData, 'promise'>) {
  const toastId = `completed:${props.txHash}`
  toast(<ToastCompleted {...props} onDismiss={() => toast.dismiss(toastId)} />, {
    ...TOAST_OPTIONS,
    toastId,
    autoClose: 5000,
  })
}

export function createFailedToast(props: Omit<NotificationData, 'promise'>) {
  const toastId = `failed:${props.txHash}`
  toast(<ToastFailed {...props} onDismiss={() => toast.dismiss(toastId)} />, {
    ...TOAST_OPTIONS,
    toastId,
    autoClose: 5000,
  })
}

export function createInfoToast(props: Omit<NotificationData, 'promise'>) {
  const toastId = `info:${props.txHash}`
  toast(<ToastInfo {...props} onDismiss={() => toast.dismiss(toastId)} />, {
    ...TOAST_OPTIONS,
    toastId,
    autoClose: 5000,
  })
}

export { toast }
