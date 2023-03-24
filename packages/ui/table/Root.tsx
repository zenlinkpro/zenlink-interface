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
      'overflow-hidden overflow-x-auto rounded-xl sm:rounded-2xl z-10 shadow-md shadow-black/20 bg-black/[0.02] dark:bg-white/[0.02]',
    )}
  >
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  </div>
)

export default Root
