import type { FC } from 'react'
import type { NotificationData } from './index'
import { XCircleIcon } from '@heroicons/react/24/outline'

import { Trans } from '@lingui/macro'
import { Chain } from '@zenlink-interface/chain'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'

interface ToastFailedProps extends Omit<NotificationData, 'promise'> {
  onDismiss: () => void
}

export const ToastFailed: FC<ToastFailedProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<XCircleIcon className="text-red" height={18} width={18} />}
        summary={summary.failed}
        title={<Trans>Transaction Failed</Trans>}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
