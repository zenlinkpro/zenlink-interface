import type { FC } from 'react'

import { Trans } from '@lingui/macro'
import { classNames } from '../index'
import { Typography } from '../typography'

interface ToastButtonsProps {
  href?: string
  onDismiss: () => void
}

export const ToastButtons: FC<ToastButtonsProps> = ({ href, onDismiss }) => {
  return (
    <div className={classNames(href ? 'grid-cols-2' : 'grid-cols-auto', 'grid divide-x divide-slate-800/5 dark:divide-slate-200/5')}>
      {href && (
        <Typography
          as="a"
          className="py-3 text-blue text-center hover:bg-slate-300/20 dark:hover:bg-slate-700/20 cursor-pointer border-t border-slate-500/20 dark:border-slate-200/5"
          href={href}
          target="_blank"
          variant="xs"
          weight={600}
        >
          <Trans>View Detail</Trans>
        </Typography>
      )}
      <Typography
        className="py-3 text-blue text-center hover:bg-slate-300/20 dark:hover:bg-slate-700/20 cursor-pointer border-t border-slate-500/20 dark:border-slate-200/5"
        onClick={onDismiss}
        variant="xs"
        weight={600}
      >
        <Trans>Dismiss</Trans>
      </Typography>
    </div>
  )
}
