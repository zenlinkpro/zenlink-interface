import { Chain } from '@zenlink-interface/chain'
import type { FC } from 'react'

import { Loader } from '..'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import type { NotificationData } from '.'

interface ToastPendingProps extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastPending: FC<ToastPendingProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<Loader width={18} height={18} className="text-blue" />}
        title="Transaction Pending"
        summary={summary.pending}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
