import { Chain } from '@zenlink-interface/chain'
import type { FC } from 'react'

import { Trans } from '@lingui/macro'
import { HalfCircleIcon } from '../icons'
import { ToastButtons } from './ToastButtons'
import { ToastContent } from './ToastContent'
import type { NotificationData } from './index'

interface ToastInfoProps extends Omit<NotificationData, 'promise'> {
  onDismiss: () => void
}

export const ToastInfo: FC<ToastInfoProps> = ({ href, chainId, txHash, onDismiss, summary }) => {
  return (
    <>
      <ToastContent
        icon={<HalfCircleIcon className="text-blue" height={18} width={18} />}
        summary={summary?.info}
        title={<Trans>Transaction Info</Trans>}
      />
      <ToastButtons href={href || Chain.from(chainId).getTxUrl(txHash)} onDismiss={onDismiss} />
    </>
  )
}
