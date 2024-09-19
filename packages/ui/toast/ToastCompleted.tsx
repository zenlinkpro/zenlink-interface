import type { FC } from 'react'
import type { NotificationData } from './index'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

import { Trans } from '@lingui/macro'
import { Chain } from '@zenlink-interface/chain'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

interface ToastCompletedProps extends Omit<NotificationData, 'promise'> {
  onDismiss: () => void
}

export const ToastCompleted: FC<ToastCompletedProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<CheckCircleIcon className="text-green-600 dark:text-green" height={18} width={18} />}
        summary={summary.completed}
        title={<Trans>Transaction Completed</Trans>}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
