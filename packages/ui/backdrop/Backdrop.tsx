import type { JSX, ReactNode } from 'react'

interface Props {
  children?: ReactNode
  backdrop?: ReactNode
}

export function Backdrop({ children, backdrop }: Props): JSX.Element {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">{backdrop}</div>
      {children}
    </>
  )
}
