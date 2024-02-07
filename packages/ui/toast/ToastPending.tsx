import { Chain } from '@zenlink-interface/chain'
import type { FC } from 'react'

import { Trans } from '@lingui/macro'
import { Loader } from '..'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import type { NotificationData } from '.'

interface ToastPendingProps extends Omit<NotificationData, 'promise'> {
  onDismiss: () => void
}

export const ToastPending: FC<ToastPendingProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<Loader className="text-blue" height={18} width={18} />}
        summary={summary.pending}
        title={<Trans>Transaction Pending</Trans>}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
