import type { FC } from 'react'
import React from 'react'

import { classNames } from '../index'

export interface RootProps extends
  React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  showShadow?: boolean
}

const Root: FC<RootProps> = ({
  className,
  children,
  showShadow = false,
  ...props
}) => (
  <div
    className={classNames(
      className,
      showShadow && 'shadow-table-root',
      'overflow-hidden overflow-x-auto rounded-xl border border-slate-500/50 sm:rounded-2xl z-10 bg-white/80 dark:bg-white/[0.02]',
    )}
  >
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  </div>
)

export default Root
