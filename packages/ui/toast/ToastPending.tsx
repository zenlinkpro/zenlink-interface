import type { FC } from 'react'
import type { NotificationData } from '.'

import { Trans } from '@lingui/macro'
import { Chain } from '@zenlink-interface/chain'
import { Loader } from '..'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

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
