import type { FC, HTMLProps } from 'react'

import { classNames } from '../index'

export interface CircleProps extends HTMLProps<HTMLDivElement> {
  radius: number
}

export const Circle: FC<CircleProps> = (props) => {
  return (
    <div
      {...props}
      className={classNames(props.className, 'bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse overflow-hidden shimmer')}
      style={{ minWidth: props.radius, minHeight: props.radius, width: props.radius, height: props.radius }}
    />
  )
}
