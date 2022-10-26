import { Chain } from '@zenlink-interface/chain'
import type { FC } from 'react'

import { HalfCircleIcon } from '../icons'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import type { NotificationData } from './index'

interface ToastInfoProps extends Omit<NotificationData, 'promise'> {
  onDismiss(): void
}

export const ToastInfo: FC<ToastInfoProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<HalfCircleIcon width={18} height={18} className="text-blue" />}
        title="Transaction Info"
        summary={summary?.info}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
