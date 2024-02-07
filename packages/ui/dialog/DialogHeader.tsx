import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'

import { Typography } from '..'
import { IconButton } from '../iconbutton'

export interface DialogHeaderProps {
  title: string | ReactNode
  onClose?: () => void
  onBack?: () => void
  className?: string
  border?: boolean
  children?: ReactNode | Array<ReactNode>
}

const DialogHeader: FC<DialogHeaderProps> = ({ title, onBack, onClose, border = true, className, children }) => {
  return (
    <div
      className={classNames(
        className,
        border ? 'border-b border-slate-500/20 dark:border-slate-200/5' : '',
        'grid grid-cols-[40px_auto_40px] items-center absolute top-0 left-0 right-0 px-3 h-12',
      )}
    >
      {onBack
        ? (
          <IconButton className="flex items-center justify-center w-6 h-6 gap-2 cursor-pointer" onClick={onBack}>
            <ChevronLeftIcon className="cursor-pointer text-slate-100 hover:text-slate-50" height={24} width={24} />
          </IconButton>
          )
        : (
          <div />
          )}

      <Typography as="h3" className="flex justify-center text-lg font-medium leading-6 text-slate-900 dark:text-slate-100" weight={500}>
        {title}
      </Typography>

      <div className="flex justify-end">
        {children || (onClose
          ? (
            <IconButton className="cursor-pointer" onClick={onClose}>
              <XMarkIcon className="text-slate-900 dark:text-slate-100" height={24} width={24} />
            </IconButton>
            )
          : (
            <span />
            ))}
      </div>
    </div>
  )
}

export default DialogHeader
