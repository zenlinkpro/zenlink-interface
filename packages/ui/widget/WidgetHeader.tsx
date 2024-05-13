import type { FC, ReactNode } from 'react'

import { classNames } from '../index'
import { Typography } from '../typography'

export interface WidgetHeaderProps {
  title: ReactNode
  children?: ReactNode
  className?: string
}

export const WidgetHeader: FC<WidgetHeaderProps> = ({ title, children, className }) => {
  return (
    <div className={classNames(className, 'p-3 mx-0.5 grid grid-cols-4 items-center pb-4 font-medium')}>
      <Typography className="flex items-center col-span-3 gap-2 text-black dark:text-slate-100" weight={500}>
        {title}
      </Typography>
      <div className="flex justify-end">{children}</div>
    </div>
  )
}
