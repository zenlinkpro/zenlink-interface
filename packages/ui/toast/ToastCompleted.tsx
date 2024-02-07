import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Chain } from '@zenlink-interface/chain'
import type { FC } from 'react'

import { Trans } from '@lingui/macro'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import type { NotificationData } from './index'

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
