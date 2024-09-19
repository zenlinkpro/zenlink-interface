import type { FC } from 'react'
import type { NotificationData } from './index'

import { useEffect, useState } from 'react'
import { ToastCompleted } from './ToastCompleted'
import { ToastFailed } from './ToastFailed'
import { ToastPending } from './ToastPending'

interface ToastInlineProps extends NotificationData {
  promise: Promise<any>
  onDismiss: () => void
}

export const ToastInline: FC<ToastInlineProps> = ({ promise, onDismiss, ...props }) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    promise
      .then(() => {
        setSuccess(true)
        setTimeout(onDismiss, 5000)
      })
      .catch(() => {
        setError(true)
        setTimeout(onDismiss, 5000)
      })
  }, [onDismiss, promise])

  if (success)
    return <ToastCompleted onDismiss={onDismiss} {...props} />
  if (error)
    return <ToastFailed onDismiss={onDismiss} {...props} />
  return <ToastPending onDismiss={onDismiss} {...props} />
}
