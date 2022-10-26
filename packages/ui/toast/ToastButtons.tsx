import type { FC } from 'react'

import { classNames } from '../index'
import { Typography } from '../typography'

interface ToastButtonsProps {
  href?: string
  onDismiss(): void
}

export const ToastButtons: FC<ToastButtonsProps> = ({ href, onDismiss }) => {
  return (
    <div className={classNames(href ? 'grid-cols-2' : 'grid-cols-auto', 'grid divide-x divide-slate-200/5')}>
      {href && (
        <Typography
          as="a"
          href={href}
          target="_blank"
          variant="xs"
          weight={600}
          className="py-3 text-blue text-center hover:bg-slate-700/20 cursor-pointer border-t border-slate-200/5"
        >
          View Detail
        </Typography>
      )}
      <Typography
        onClick={onDismiss}
        variant="xs"
        weight={600}
        className="py-3 text-blue text-center hover:bg-slate-700/20 cursor-pointer border-t border-slate-200/5"
      >
        Dismiss
      </Typography>
    </div>
  )
}
