import type { JSX } from 'react'

export interface ShellProps {
  children?: React.ReactNode
}

export function Shell({ children }: ShellProps): JSX.Element {
  return <div>{children}</div>
}
