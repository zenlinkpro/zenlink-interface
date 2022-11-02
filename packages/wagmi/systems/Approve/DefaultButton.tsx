import { classNames } from '@zenlink-interface/ui'
import type { FC } from 'react'
import React from 'react'

export interface DefaultButtonProps {
  className?: string
  children: React.ReactNode
}

export const DefaultButton: FC<DefaultButtonProps> = ({ className, children }) => {
  return (
    <div
      className={classNames(
        className,
        'sm:flex mb-4 mt-2 mx-3 flex flex-col gap-1 w-6 h-6 disabled:pointer-events-none disabled:saturate-[0] cursor-pointer',
      )}
    >
      {children}
    </div>
  )
}
