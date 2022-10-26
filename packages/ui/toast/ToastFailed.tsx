import { XCircleIcon } from '@heroicons/react/24/outline'
import { Chain } from '@zenlink-interface/chain'
import type { FC } from 'react'

import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import type { NotificationData } from './index'

interface ToastFailedProps extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastFailed: FC<ToastFailedProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<XCircleIcon width={18} height={18} className="text-red" />}
        title="Transaction Failed"
        summary={summary.failed}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
