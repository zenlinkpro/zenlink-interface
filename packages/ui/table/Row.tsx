import type { FC } from 'react'
import React from 'react'

import { classNames } from '../index'

export interface RowProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  size?: 'default' | 'lg'
}

const Row: FC<RowProps> = ({ children, className, size = 'default', ...props }) => (
  <tr
    {...props}
    className={classNames(
      className,
      size === 'default' ? 'h-[52px]' : 'h-[72px]',
      'w-full even:bg-black/[0.04] even:dark:bg-white/[0.04] hover:opacity-[0.85]',
    )}
  >
    {children}
  </tr>
)

export default Row
