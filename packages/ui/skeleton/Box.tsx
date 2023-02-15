import type { FC, HTMLProps } from 'react'

import { classNames } from '../index'

export const Box: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return <div {...props} className={classNames(props.className, 'rounded-lg animate-pulse overflow-hidden shimmer')} />
}
