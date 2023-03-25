import type { FC, HTMLProps } from 'react'

import { classNames } from '../index'

export const Box: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={classNames(props.className, 'bg-slate-300 dark:bg-slate-700 rounded-lg overflow-hidden shimmer')}
    />
  )
}
