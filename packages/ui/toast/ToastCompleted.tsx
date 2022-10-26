import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Chain } from '@zenlink-interface/chain'
import type { FC } from 'react'

import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import type { NotificationData } from './index'

interface ToastCompletedProps extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastCompleted: FC<ToastCompletedProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<CheckCircleIcon width={18} height={18} className="text-green" />}
        title="Transaction Completed"
        summary={summary.completed}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
