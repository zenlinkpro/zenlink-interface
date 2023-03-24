import type { FC } from 'react'
import React from 'react'

const HeadCell: FC<
  React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
> = ({ children, ...props }) => (
  <th
    {...props}
    className="h-[52px] px-3 sm:px-4 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-high-emphesis whitespace-nowrap"
  >
    {children}
  </th>
)

export default HeadCell
