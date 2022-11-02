import type { FC, ReactNode } from 'react'
import { classNames } from '../index'

interface DotsProps {
  children?: ReactNode
  className?: string
}

export const Dots: FC<DotsProps> = ({ children = <span />, className }) => {
  return (
    <span
      className={classNames(
        'after:inline-block after:content-[\'.\'] after:animate-ellipsis after:w-4 after:text-left',
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Dots
