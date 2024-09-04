import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import { classNames } from '../index'

export interface ContentProps {
  className?: string
  children: ReactNode | ReactNode[]
}

export const Content = forwardRef<HTMLDivElement, ContentProps>(({ className, children }, ref) => {
  return (
    <div className={classNames(className, 'relative inline-block w-full pt-12 pb-[68px] !my-0 h-full px-3 bg-white dark:bg-slate-800')} ref={ref}>
      {children}
    </div>
  )
})
