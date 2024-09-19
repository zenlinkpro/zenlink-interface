import type { FC, ReactNode } from 'react'
import classNames from 'classnames'
import { forwardRef } from 'react'

export interface DialogContentProps {
  className?: string
  children?: ReactNode
}

const DialogContent: FC<DialogContentProps> = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children }, ref) => {
    return (
      <div
        className={classNames(
          className,
          'text-left max-w-md inline-block w-full pt-12 pb-[68px] !my-0 h-full px-3 bg-white dark:bg-slate-800 shadow-xl align-middle transition-all transform rounded-t-2xl rounded-b-none sm:rounded-2xl relative',
        )}
        ref={ref}
      >
        {children}
      </div>
    )
  },
)

export default DialogContent
