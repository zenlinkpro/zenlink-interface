import type { JSX } from 'react'
import classNames from 'classnames'

export interface TableContainerProps {
  children?: React.ReactNode
  className?: string
}

function Container({ children, className }: TableContainerProps): JSX.Element {
  return <div className={classNames(className)}>{children}</div>
}

export default Container
