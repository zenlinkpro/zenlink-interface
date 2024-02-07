import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { FC, ReactNode } from 'react'

import { IconButton, classNames } from '../index'
import { Typography } from '../typography'

export interface HeaderProps {
  title: string | ReactNode
  onBack?: () => void
  onClose?: () => void
  border?: boolean
  arrowDirection?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export const Header: FC<HeaderProps> = ({ className, title, border = true, onBack, onClose, arrowDirection = 'left' }) => {
  return (
    <div
      className={classNames(
        className,
        border ? 'border-b border-slate-200/5' : '',
        'grid grid-cols-[40px_auto_40px] absolute top-0 left-0 right-0 px-3 h-[48px]',
      )}
    >
      {onBack
        ? (
          <IconButton className="flex items-center justify-center gap-2 cursor-pointer" onClick={onBack}>
            {arrowDirection === 'left' && (
              <ChevronLeftIcon className={classNames('cursor-pointer ')} height={24} width={24} />
            )}
            {arrowDirection === 'bottom' && (
              <ChevronDownIcon className={classNames('cursor-pointer ')} height={24} width={24} />
            )}
            {arrowDirection === 'top' && (
              <ChevronUpIcon className={classNames('cursor-pointer ')} height={24} width={24} />
            )}
            {arrowDirection === 'right' && (
              <ChevronRightIcon className={classNames('cursor-pointer ')} height={24} width={24} />
            )}
          </IconButton>
          )
        : (
          <div />
          )}
      <Typography
        as="h3"
        className={classNames('flex items-center justify-center gap-4 text-base font-medium leading-6')}
        weight={500}
      >
        {title}
      </Typography>
      {onClose
        ? (
          <div className="flex items-center justify-end">
            <IconButton className="flex items-center justify-end cursor-pointer" onClick={onClose}>
              <XMarkIcon height={24} width={24} />
            </IconButton>
          </div>
          )
        : (
          <div />
          )}
    </div>
  )
}
