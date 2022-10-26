import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import { classNames } from '../index'

export interface ContentProps {
  className?: string
  children: ReactNode | ReactNode[]
}

export const Content = forwardRef<HTMLDivElement, ContentProps>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={classNames(className, 'inline-block w-full pt-12 pb-[68px] !my-0 h-full px-3')}>
      {children}
    </div>
  )
})
