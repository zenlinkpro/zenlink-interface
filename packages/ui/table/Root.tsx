import type { FC } from 'react'
import React from 'react'

import { classNames } from '../index'

const Root: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={classNames(
      className,
      'overflow-hidden overflow-x-auto rounded-xl border border-slate-500/50 sm:rounded-2xl z-10 shadow-sm shadow-black/20 bg-white/80 dark:bg-white/[0.02]',
    )}
  >
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  </div>
)

export default Root
